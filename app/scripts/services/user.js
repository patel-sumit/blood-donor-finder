/**
 * Created by Sumit Patel on 31/12/2016.
 */

angular.module('bloodDonorFinderApp')
    .service('UserService',['store','$q','$timeout', function (store,$q,$timeout) {
       

        var service = this,
            currentUser = null,
            allUsers=null,
            position={};
        service.setCurrentUser = function(user) {
            currentUser = user;
            store.set('user', user);
            return currentUser;
        };
        service.getCurrentUser = function() {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };
        service.displayFloatingLabel = function () {
            $(document).on('shown.bs.modal', function (e) {
                $('[autofocus]', e.target).focus();
            });
            if($('.bs-float-label input').length){
                var bs_float_on_class = "on";
                var bs_float_show_class = "show";

                $('.float-input').on('bs-check-value', function(){
                    var _bs_label = $(this).closest('.bs-float-label').find('.float-label');
                    if (this.value !== ''){
                        _bs_label.addClass(bs_float_show_class);
                    } else {
                        _bs_label.removeClass(bs_float_show_class);
                    }
                })
                    .on("keyup",function(){
                        $(this).trigger("bs-check-value");
                    })
                    .on("focus",function(){
                        $(this).closest(".bs-float-label").find('.float-label').addClass(bs_float_on_class);
                    })
                    .on("blur",function(){
                        $(this).closest(".bs-float-label").find('.float-label').removeClass(bs_float_on_class);
                    }).trigger("bs-check-value");
                ;
            }

        };
        service.Authenticate=function(user) {
            /*return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));*/
            var email = user.username;
            var password = user.password;
            var loginalert = user.loginAlert;

            return  firebase.auth().signInWithEmailAndPassword(
                email,
                password).then(
                function (authData) {
                    var uname = authData.email.split("@")[0];

                    currentUser={
                        username: uname,
                        email:authData.email,
                        uid: authData.uid
                    };
                    store.set('user', currentUser);
                    return currentUser;

                }).catch(function(error){
                var loginErrMsg="";
                switch (error.code) {
                    case "INVALID_PASSWORD":
                        loginErrMsg = "Error: The specified password is incorrect.";
                        break;
                    case "INVALID_USER":
                        loginErrMsg = "Error: The specified user does not exist.";
                        break;
                    case "INVALID_EMAIL":
                        loginErrMsg = "Error: The specified email is not valid.";
                        break;
                    default:
                        loginErrMsg = error.code;
                }
                return loginErrMsg;
                /*loginalert.style.display = "";
                 loginalert.innerText = error.message;*/
                //console.log("Login Failed!", error);
            });
        };
        service.Create =function(user) {
           /* return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));*/
            var name = user.name;
            var email = user.email;
            var password = user.password;
            var phone = user.phone;
            var address = user.address;
            var bdate =user.bdate;
            var bloodgroup = user.bloodgroup;


            var newUser = {
                name:name,
                email: email,
                password: password,
                phone:phone,
                address:address,
                bdate:bdate,
                bloodgroup:bloodgroup,
                latt:user.position.latt,
                longi:user.position.longi,
                id:'',
            };

            return  firebase.auth().createUserWithEmailAndPassword(email,password).then(function (userData) {
                console.log("Successfully created user account with uid:", userData.uid);
                newUser.id=userData.uid;
                return firebase.database().ref('/users').push(newUser).then(function () {
                     return "success";
                 });

            }).catch(function (error) {
                console.log(error);
                var loginErrMsg = "";
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        loginErrMsg = "Error: The specified email is already in use.";
                        break;

                    default:
                        loginErrMsg = error.code;
                }
                    return loginErrMsg;
                //console.log("Error creating user:", error);
                /*signupAlert.style.display = "";
                signupAlert.innerText = loginErrMsg;
                $('#signupform')[0].reset();*/
            });
        }
        service.addNewPerson =function(user) {            
            var name = user.name;
            var email = user.email;
            var phone = user.phone;
            var address = user.address;
            var bdate =user.bdate;
            var bloodgroup = user.bloodgroup;

            var newUser = {
                name:name,
                email: email,
                phone:phone,
                address:address,
                bdate:bdate,
                bloodgroup:bloodgroup,
                id:'',
            };

            return firebase.database().ref('/users').push(newUser).then(function (userData) {
                return "success";               
            }).catch(function (error) {
                console.log(error);
                var loginErrMsg = "";
                oginErrMsg = error.code;
                return loginErrMsg;
            });
        }
        service.getUsersbyBloodgroup=function(bgroup,curUserId) {
                var me=this;
               return firebase.database().ref('/users').once("value").then(function(userdata) {
                   allUsers=userdata;
                   var arrUsers = $.map(userdata.val(), function (item, index) {
                       if(item.id!=curUserId && item.bloodgroup==bgroup)
                        return [item];
                    });
                   store.set("ALLUsers",userdata.val());
                   return arrUsers
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                   return [];
                });

        },
        service.getUsersbyBloodgroupOffline=function(bgroup,curUserId) {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    var Allusers=store.get("ALLUsers");
                    var arrUsers = $.map(Allusers, function (item, index) {
                        if(item.id!=curUserId && item.bloodgroup==bgroup)
                            return [item];
                    });
                        resolve(arrUsers);

                }, 1000);
            });
        }
        service.getLocation= function() {
            if (!position) {
                position.latt = store.get('latt');
                position.longi = store.get('longi');
            }
            return position;
        }
        service.setLocation= function(location) {

            store.set('latt', location.latt);
            store.set('longi', location.longi);

        }
}]);