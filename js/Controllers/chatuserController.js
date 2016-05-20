"use strict";
//where chat window open
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
          $scope.displaySideBar = false;
          $scope.popupClass = 'button-setting';
        }
        else {
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
    }
    //function to show user info in one to one chat

    $scope.showUserInfo = function()
    {
          if($scope.individualChatFlag)
          {
              $ionicPopup.alert({
             templateUrl: 'templates/Userinfo.html'
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
    //geUserPersonalDetail();
      };
   