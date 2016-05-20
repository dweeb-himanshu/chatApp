"use strict";
//after login screen here I have to load all recent messeges
angular.module("chatApp")
  .controller('chatCtrl', chatCtrl);

  function chatCtrl($scope, $rootScope, chatService, $ionicLoading,$timeout,$ionicPopup, $http,  $state, $location, $ionicModal, $ionicSideMenuDelegate) {
 
 $scope.current = JSON.parse(localStorage.getItem("userDetails"));
 $scope.recentmesseges = {};
 $scope.allContacts = {};
//init applozic plugin for 
 $applozic.fn.applozic({
                        userId: $scope.current.user_id,
                        userName: $scope.current.username, 
                        imageLink:$scope.current.profile_image,
                        appId: '31b9e5c457ead58f874571e5ce7eb730',  
                          ojq: $original,
                          maxAttachmentSize: 25, 
                          desktopNotification: true,
                          locShare: false,
                          googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",
                          onInit: function() { 
                          $applozic.fn.applozic('getMessages',
                          {
                            callback : function(data)
                            {
                              console.log(data);
                              $scope.recentmesseges = data.data
                            }
                      }); 
                                 }
                     });
                   
   
     $scope.isNotificationOn = true;
     $scope.displaySideBar = false;
     $scope.popupClass='button-setting';
    $scope.current = JSON.parse(localStorage.getItem("userDetails"));
    function getallContacts()
    {
        chatService.getallContact($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              for(var i in response.data.blocks){ 
              $scope.allContacts[i] = response.data.blocks[i];
            };
            });
    };

    //get current chhat history
    
    $scope.showsearchBar = function ()
    {
        $scope.isSearchtrue = true;
    };
  //   /**
  //    * Hides the searchbar in view
  //    */
    $scope.hideSearchbar = function ()
    {
      $scope.isSearchtrue = false;
      $state.go($state.current, {}, {reload: true});
    };

    $scope.emptySearch = function()
    {
       $timeout(function() {
          $scope.search = null;
          $scope.search = '';
          $scope.$apply();
        }, 10);
    }
    //for left toggle navigation
    $scope.goToGroup = function ()
    {
        $location.path('/group');
    }
  //   //function to go to contact page
    $scope.goToContact = function ()
    {
        $location.path('/contact');
    }
     $scope.toggleSideBar = function () {
        if($scope.displaySideBar){
          $scope.displaySideBar = false;
          $scope.popupClass = 'button-setting';
        }
        else {
        $scope.displaySideBar = true;
        $scope.popupClass = 'close-button-setting';
        }
    };
  //   /**
  //    * * function for logout reset local storage and move to login page
  //    * @Author- Himanshu Gupta
  //    */
     $scope.logOut = function()
     {
        localStorage.removeItem('userDetails');
        localStorage.removeItem('userData');
        localStorage.removeItem('groupData');
        $location.path('/login');
     }

    function getOtherUserDetail()
    {

           chatService.getOtherUserInfo($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              $rootScope.OtherUserInfo = response;
            });
    }
    //function to show user info in one to one chat

    $scope.showUserInfo = function()
    {
              $ionicPopup.alert({
             templateUrl: 'templates/Userinfo.html'
           })
          .then(function(res) {

           });
    };
    $scope.offNotification = function()
    {
            chatService.offNotification($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              $scope.isNotificationOn = false;
            });
    }
    $scope.onNotification = function()
    {
            chatService.onNotification($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              $scope.isNotificationOn = true;
            });
    }
     getOtherUserDetail();
     getallContacts();
};
