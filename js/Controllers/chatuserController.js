"use strict";
angular.module("chatApp")
  .controller('chatuserCtrl', chatuserCtrl);

  function chatuserCtrl($scope, $state,$rootScope, $anchorScroll,chatService,$ionicPopup, $location, $ionicScrollDelegate, $stateParams, $timeout) {
   
      $scope.paramDetails=JSON.parse($stateParams.userDetailParam);
    $scope.groupDetails = JSON.parse($stateParams.groupDetailParam);
    $scope.currentUser = JSON.parse(localStorage.getItem("userDetails"));
    console.log($scope.groupDetails);
    console.log($scope.paramDetails);
    if($scope.paramDetails){
      $scope.individualChatFlag = true; //Flag set for individual chat
    }
    if($scope.groupDetails){
      $scope.individualChatFlag = false; //Flag unset for individual chat, group chat enabled.
    }

     $scope.toggleSideBar = function () {
        //$ionicSideMenuDelegate.toggleRight();
        if($scope.displaySideBar){
          $scope.displaySideBar = false;
          $scope.popupClass = 'button-setting';
        }
        else {
        $scope.displaySideBar = true;
        $scope.popupClass = 'close-button-setting';
        }
    };
$scope.myGoBack = function () {
            $location.path('/chat');
    };

    $scope.logOut = function()
     {
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userData');
        localStorage.removeItem('groupData');
        $location.path('/login');
     }
      //function to get groupdata detail like blocked user and push notoification state
    function geUserPersonalDetail()
    {
      if($scope.individualChatFlag)
      {
        chatService.getGroupData($scope.currentUser.user_id,$scope.currentUser.apartment_id)
            .then(function(response){
              console.log(response);
          var itr = 0;
          console.log(response.data.blocked_users);
          for(itr in response.data.blocked_users){
          if($scope.paramDetails.user_id == response.data.blocked_users[itr].user_id)
          {
              $scope.UserisBlocked = true;
          }
        }
            });
      }
    }
    function getOtherUserDetail()
    {
      if($scope.individualChatFlag)
      {
        chatService.getOtherUserInfo($scope.paramDetails.user_id,$scope.currentUser.apartment_id)
            .then(function(response){
              console.log(response);
              $rootScope.OtherUserInfo = response;
            });
      }
    }
    //function to show user info in one to one chat

    $scope.showUserInfo = function()
    {
          if($scope.individualChatFlag)
          {
              $ionicPopup.alert({
             templateUrl: 'client/templates/Userinfo.html'
           })
          .then(function(res) {

           });
        }
    }

    //function to get user call number
    $scope.GetotherPhonenumber = function()
    {
        if($scope.individualChatFlag)
          {

              $ionicPopup.alert({
                  title: $rootScope.OtherUserInfo.data.PhoneNo,
                  content: ''
                }).then(function(res) {
                });
        }
    }
    getOtherUserDetail();
    geUserPersonalDetail();
      };
   