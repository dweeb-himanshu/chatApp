"use strict";
var app = angular.module("chatApp");
  app.controller('loginwebCtrl',['$scope', '$window','chatService','$rootScope', '$location', '$ionicPopup',function($scope, $window, chatService, $rootScope,$location,$ionicPopup) {
    if(localStorage.getItem("userDetails") === null)
    {
      $rootScope.Isloggedin=false;
      $scope.username = null;
      $scope.password = null;
      $scope.signIn = function (user)
      {
        $scope.isLoading = true;
        //console.log(user.username);    
        chatService.postUserInfo(user)
          .success(function(response){
            console.log(response);
            $rootScope.userDetails = response;
            //check for user authentication
            console.log(response.login_result);
            if(response.login_result == 'fail')
            {
              //ION POPUP FOR INVALID DETAIL
                  $ionicPopup.alert({
                  title: '',
                  content: 'Invalid user name or password'
                }).then(function(res) {
                  //redirect to login
                    $location.path('/login');
                });
            }
            else
            {
              window.localStorage["userDetails"] = angular.toJson(response);
              $rootScope.Isloggedin=true;
              /*This flag will ensure that userData API in chatController is called
              only once.
              */
              $scope.current = JSON.parse(localStorage.getItem("userDetails"));
              console.log($scope.current);
              

              // function enablePushnotification()
              // {
              //   var userPxy = {
              //             'applicationId': 'AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4', 
              //             'userId': $scope.current.user_id, 
              //             'registrationId': '31b9e5c457ead58f874571e5ce7eb730',
              //               'pushNotificationFormat' : '1'
              //           };

              //         $.ajax({
              //           url: "https://apps.applozic.com/rest/ws/register/client",
              //                 type: 'post',
              //                 data: JSON.stringify(userPxy),
              //                 contentType: 'application/json',
              //                 headers: {'Application-Key': 'AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4'}, 
              //                     success: function (result) {
              //                         console.log(result);
              //                     }
              //         });
              // }

              $rootScope.apiCallFlag = false;
              $location.path('/chat');
            }
          })
          .error(function(err){
            console.error(err);
          });
      };
    }
    else {
            $rootScope.Isloggedin=true;
            $location.path('/chat');
          }
  }]);
