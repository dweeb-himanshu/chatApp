"use strict";
//where chat window open
angular.module("chatApp")
  .controller('chatuserCtrl', chatuserCtrl);

  function chatuserCtrl($scope,$http, $state,$rootScope, $anchorScroll,chatService,$ionicPopup, $location, $ionicScrollDelegate, $stateParams, $timeout) {
   
    $('.pane').css({
        zIndex : '1',
        background : 'transparent'
      });
    $scope.paramDetails=JSON.parse($stateParams.userDetailParam);
    $scope.groupDetails = JSON.parse($stateParams.groupDetailParam);
    $scope.currentUser = JSON.parse(localStorage.getItem("userDetails"));
     $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
    var AuthorizationCode = localStorage.getItem("AuthorizationCode");
    $scope.UserisBlocked = false;
    console.log($scope.groupDetails);
    console.log($scope.paramDetails);
    if($scope.paramDetails){
      $scope.individualChatFlag = true; //Flag set for individual chat
          console.log($scope.paramDetails.user_id);
          $applozic.fn.applozic('loadTab', $scope.paramDetails.user_id);
          console.log('applozic');
     }
    if($scope.groupDetails){    
      $applozic.fn.applozic('loadGroupTab', $scope.groupDetails.group_id);
     }

     $scope.toggleSideBar = function () {
        //$ionicSideMenuDelegate.toggleRight();
        if($scope.displaySideBar){
          $('.pane').css({
        zIndex : '1',
        background : 'transparent'
      });
          $scope.displaySideBar = false;
          $scope.popupClass = 'button-setting';
        }
        else {
          $('.pane').css({
        zIndex : '45078689',
        background : 'transparent'
});
        $scope.displaySideBar = true;
        $scope.popupClass = 'close-button-setting';
        }
    };
$scope.myGoBack = function () {
  $applozic(".mck-close-sidebox").trigger('click');
            $location.path('/chat');
    };

    $scope.logOut = function()
     {
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userData');
        localStorage.removeItem('groupData');
        $location.path('/login');
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
      else
      {
          chatService.getOtherUserInfo($scope.groupDetails.admin_id,$scope.currentUser.apartment_id)
            .then(function(response){
              console.log(response);
              $rootScope.OtherUserInfo = response;
            });
      }
    }
    //function to show user info in one to one chat

    $scope.showUserInfo = function()
    {
          $ionicPopup.alert({
             templateUrl: 'templates/Userinfo.html'
           })
          .then(function(res) {

           });
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
    $scope.blockUser = function(){
      if($scope.individualChatFlag){

          $ionicPopup.confirm({
             title: 'Confirm Block',
             template: 'Are you sure you want Block ?'
           }).then(function(res) {
             if(res) {
                 $http({
                  url: 'https://apps.applozic.com/rest/ws/user/block',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        },
        params: { 
                    'userId' : $scope.paramDetails.user_id
                }
              })
              .then(function(response) {
              }, 
              function(response) { // optional
                      // failed
              });
                  chatService.BlockpersonalUser($scope.currentUser.user_id,$scope.currentUser.apartment_id,$scope.paramDetails.user_id)
                .then(function(response){
                 $scope.UserisBlocked = true;
                });
             } else {
             }
           });

      }
      else{
        console.log("Blocking the group..."+$scope.groupDetails.block_id);
        var blockedGroup = {
          user_id: $scope.currentUser.user_id,
          apartment_id: $scope.currentUser.apartment_id,
          block_id: $scope.groupDetails.block_id
        };
        $ionicPopup.confirm({
             title: 'Confirm Block',
             template: 'Are you sure you want Block ?'
           }).then(function(res) {
             if(res) {

               $http({
                  url: 'https://apps.applozic.com/rest/ws/group/left',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        },
        params: { 
                    'groupId' : $scope.groupDetails.group_id
                }
              })
              .then(function(response) {

              }, 
              function(response) { // optional
                      // failed
              });
              chatService.leftGroup(blockedGroup)
          .then(function(response){
            console.log(response);
            window.localStorage["userData"] = angular.toJson(response);
                    $location.path('/chat');
          });
             }
             else
             {

             }
        });
    }
    $state.go($state.current, {}, {reload: true});
      };
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
    };

    $scope.unBlockUser = function(){
     if($scope.individualChatFlag){
      $scope.isReceiverBlocked = false;
             $http({
                  url: 'https://apps.applozic.com/rest/ws/user/unblock',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        },
        params: { 
                    'userId' : $scope.paramDetails.user_id
                }
              })
              .then(function(response) {

              }, 
              function(response) { // optional
                      // failed
              });
       chatService.UnBlockpersonalUser($scope.currentUser.user_id,$scope.currentUser.apartment_id,$scope.paramDetails.user_id)
            .then(function(response){
              console.log(response);
             $scope.UserisBlocked = false;
            });
            $state.go($state.current, {}, {reload: true});
    }
    }
    getOtherUserDetail();
    geUserPersonalDetail();
      };
   