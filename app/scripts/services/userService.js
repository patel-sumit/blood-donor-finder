/**
 * Created by Sumit Patel on 09/01/2017.
 */
/**
 * Created by Sumit Patel on 31/12/2016.
 */

angular.module('bloodDonorFinderApp')
    .service('UserService',['store','$q','$timeout', function (store,$q,$timeout) {


        var service = this,
            currentUser = null,
            allUsers=null,
            position={};
  
        service.Authenticate=function(user) {
            /*return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));*/
            var email = user.username;
            var password = user.password;
            var loginalert = user.loginAlert;
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
          
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

          
        }
        service.getUsersbyBloodgroup=function(bgroup,curUserId) {
            var me=this;
           

        },
            service.getUsersbyBloodgroupOffline=function(bgroup,curUserId) {
             
            }

        // private functions

        service.handleSuccess=function(res) {
            return res.data;
        }

        service.handleError=function(error) {
            return function () {
                return { success: false, message: error };
            };
        }
   
    }]);
