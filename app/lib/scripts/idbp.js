// Promise wrappers for IndexedDB

(function(global){

  // options.version may trigger an upgrade
  // options.upgrade is called with (IDBDatabase, oldVersion) if necessary
  // Returns Promise<IDBDatabase>
  var $IDBFactory_prototype_open = IDBFactory.prototype.open;
  IDBFactory.prototype.open = function(name, options) {
    var version = Object(options).version;
    var request;
    if (version) // (undefined not yet treated the same as 'not passed')
      request = $IDBFactory_prototype_open.call(this, name, version);
    else
      request = $IDBFactory_prototype_open.call(this, name);

    var upgrade = Object(options).upgrade;
    if (upgrade) request.onupgradeneeded = function(e) {
      var storeName = "\x00(IndexedDB Promises Upgrade Hack)\x00";
      try { request.result.createObjectStore(storeName); } catch (_) {}
      makeAsyncTransactionQueue(request.transaction, storeName);

      upgrade(request.result, e.oldVersion);
    };

    var blocked = Object(options).blocked;
    if (blocked) request.onblocked = blocked;

    return new Promise(function(resolve, reject) {
      request.onsuccess = function() { resolve(request.result); };
      request.onerror = function() { reject(request.error); };
    });
   };

  // Returns Promise<undefined>
  var $IDBFactory_prototype_deleteDatabase = IDBFactory.prototype.deleteDatabase;
  IDBFactory.prototype.deleteDatabase = function(name, options) {
    var request = $IDBFactory_prototype_deleteDatabase.call(indexedDB, name);

    var blocked = Object(options).blocked;
    if (blocked) request.onblocked = blocked;

    return new Promise(function(resolve, reject) {
      request.onsuccess = function() { resolve(request.result); };
      request.onerror = function() { reject(request.error); };
    });
  };

  // This is a terrible horrible, no good, very bad hack.
  //
  // Promise delivery is async, which means the result of e.g. a get()
  // request is delivered outside the transaction callback; in IDB
  // spec parlance, the transaction is not "active", and so additional
  // requests fail and the transaction may already have committed due
  // to a lack of additional requests.
  //
  // Hack around this by running a constant series of (battery
  // draining) dummy requests against an arbitrary store and
  // maintaining a custom request queue. Keep the loop alive as long
  // as new requests keep coming in.
  var $IDBObjectStore_prototype_get = IDBObjectStore.prototype.get;
  function makeAsyncTransactionQueue(tx, storeName) {
    tx._queue = [];
    var store = tx.objectStore(storeName);
    var MAX_AGE = 10; // ms
    var last = Date.now();
    (function spin() {
      while (tx._queue.length) {
        (tx._queue.shift())();
        last = Date.now();
      }
      if ((Date.now() - last) < MAX_AGE)
        $IDBObjectStore_prototype_get.call(store, -Infinity).onsuccess = spin;
    }());
  }

  // Returns Promise<undefined> with the following properties:
  //   void               abort()
  //   IDBObjectStore     objectStore(name)
  //   IDBDatabase        db
  //   IDBTransactionMode mode
  var $IDBDatabase_prototype_transaction = IDBDatabase.prototype.transaction;
  IDBDatabase.prototype.transaction = function(scope, mode) {
    var tx = $IDBDatabase_prototype_transaction.apply(this, arguments);

    var storeName = (typeof scope === 'string') ? scope : scope[0];
    makeAsyncTransactionQueue(tx, storeName);

    var p = new Promise(function(resolve, reject) {
      tx.oncomplete = function() { resolve(undefined); };
      tx.onabort = function(e) { reject(tx.error); };
    });
    p.abort = tx.abort.bind(tx);
    p.objectStore = tx.objectStore.bind(tx);
    p.db = tx.db;
    p.mode = tx.mode;
    return p;
  };

  // Simple request methods

  // These all return Promise<T> where T is the result type from IDB.
  [
    [IDBObjectStore, ['put', 'add', 'delete', 'get', 'clear', 'count']],
    [IDBIndex, ['get', 'getKey', 'count']],
    [IDBCursor, ['update', 'delete']]
  ].forEach(function(typeAndMethods) {
    var type = typeAndMethods[0],
        methods = typeAndMethods[1];
    methods.forEach(function(methodName) {
      var method = type.prototype[methodName];
      type.prototype[methodName] = function() {
        var $this = this,
            $arguments = arguments,
            transaction = transactionFor(this);
        return promiseForRequest($this, method, $arguments, transaction);
      };
    });
  });

  // Helper: IDBObjectStore or IDBIndex => IDBTransaction
  function transactionFor(source) {
    var store = ('objectStore' in source) ? source.objectStore : source;
    return store.transaction;
  }

  // Helper: Wrap an IDBRequest in a Promise<T>
  function promiseForRequest($this, method, $arguments, transaction) {
    return new Promise(function(resolve, reject) {
      // Defer request creation until transaction |active| flag is set.
      transaction._queue.push(function() {
        var request = method.apply($this, $arguments);
        request.onsuccess = function() { resolve(request.result); };
        request.onerror = function() { reject(request.error); };
      });
    });
  }

  // Cursor creation and continuation methods

  // These return Promise<IDBCursor or null>
  [
    [IDBObjectStore, ['openCursor']],
    [IDBIndex, ['openCursor', 'openKeyCursor']]
  ].forEach(function(typeAndMethods) {
    var type = typeAndMethods[0],
        methods = typeAndMethods[1];
    methods.forEach(function(methodName) {
      var method = type.prototype[methodName];
      type.prototype[methodName] = function() {
        var $this = this,
            $arguments = arguments,
            transaction = transactionFor(this);
        return new Promise(function(resolve, reject) {
          // Defer request creation until transaction |active| flag is set.
          transaction._queue.push(function() {
            var request = method.apply($this, $arguments);
            request.onsuccess = function() {
              // A cursor's request is re-used, so it must be captured.
              if (request.result) request.result._request = request;
              resolve(request.result);
            };
            request.onerror = function() { reject(request.error); };
          });
        });
      };
    });
  });

  // These return Promise<IDBCursor or null>
  ['continue', 'advance'].forEach(function(m) {
    var method = IDBCursor.prototype[m];
    IDBCursor.prototype[m] = function() {
      var $this = this,
          $arguments = arguments,
          transaction = transactionFor(this.source);
      return new Promise(function(resolve, reject) {
        // Defer request creation until transaction |active| flag is set.
        transaction._queue.push(function() {
          method.apply($this, $arguments);
          var request = $this._request;
          request.onsuccess = function() { resolve(request.result); };
          request.onerror = function() { reject(request.error); };
        });
      });
    };
  });

  // Helpers to make the basic cursor iteration cases less grotesque with
  // recursive Promises

  // TODO: Consider separating cursor object (API) from cursor result (data)

  // Returns Promise<[{key, primaryKey, value}]>
  IDBCursor.prototype.all = function() {
    var $this = this;
    var request = $this._request;
    return new Promise(function(resolve, reject) {
      var results = [];

      function iterate() {
        if (!request.result) {
          resolve(results);
          return;
        }
        try {
          results.push({key: $this.key,
                        primaryKey: $this.primaryKey,
                        value: $this.value});
          $this.continue().then(iterate, reject);
        } catch (e) {
          reject(e);
        }
      }

      request.onsuccess = iterate;
      request.onerror = function() { reject(request.error); };

      iterate();
    });
  };

  // Callback is called with {key, primaryKey, value} until
  // the cursor is exhausted.
  // Returns Promise<undefined>
  IDBCursor.prototype.forEach = function(callback) {
    var $this = this;
    var request = $this._request;
    return new Promise(function(resolve, reject) {
      function iterate() {
        if (!request.result) {
          resolve(undefined);
          return;
        }
        try {
          callback({key: $this.key,
                    primaryKey: $this.primaryKey,
                    value: $this.value});
          $this.continue().then(iterate, reject);
        } catch (e) {
          reject(e);
        }
      }

      request.onsuccess = iterate;
      request.onerror = function() { reject(request.error); };

      iterate();
    });
  };

}(this));
