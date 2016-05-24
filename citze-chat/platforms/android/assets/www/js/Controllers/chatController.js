
//after login screen here I have to load all recent messeges
angular.module("chatApp")
  .controller('chatCtrl', chatCtrl);

  function chatCtrl($scope, $rootScope,chatService,$filter, $ionicLoading,$timeout,$ionicPopup, $http,  $state, $location, $ionicModal, $ionicSideMenuDelegate) {
 
 $scope.current = JSON.parse(localStorage.getItem("userDetails"));
 $scope.recentmesseges = {};
 $scope.messageLimit = 6;
 $scope.allContacts = {};
 $scope.currentuserdetail = [];
 $scope.current = JSON.parse(localStorage.getItem("userDetails"));
    $scope.todayDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    
    console.log(typeof($scope.todayDate));
    console.log($scope.todayDate);
//init applozic plugin for 



$timeout(function() {
  $applozic.fn.applozic('getMessages',
      {
        callback : function(data)
        {
          console.log(data);
          $scope.recentmesseges = data.data;
          $scope.currentuserdetail = data.data.userDetails;
          $scope.currentgroupdetail = data.data.groupFeeds;
          $scope.$apply();
        }
  }); 
}, 10);
  $timeout(function() {
      $scope.messageLimit = 100;
    }, 2000);
     $scope.isNotificationOn = true;
     $scope.displaySideBar = false;
     $scope.popupClass='button-setting';
    $scope.current = JSON.parse(localStorage.getItem("userDetails"));
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
      $ionicPopup.confirm({
             title: 'Confirm Block',
             template: 'Are you sure you want to Log out ?'
           }).then(function(res) {
             if(res) {
                    localStorage.removeItem('userDetails');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('groupData');
                    $location.path('/login');
             }
             else{
                $scope.displaySideBar = false;
          $scope.popupClass = 'button-setting';
             }       
     });
   };

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
     /*
    *Redirects the user to chat screen
    *@method changePath
    *@param {object} User/Group Information
    */
    $scope.changePath = function (recent)
    {

        if(recent.groupId == null || recent.groupId == undefined){
           var userParam = {}
            for(itr in $scope.currentuserdetail)
            {
              if(recent.contactIds == $scope.currentuserdetail[itr].userId)
              {
                userParam.profile_image = $scope.currentuserdetail[itr].imageLink;
                userParam.username = $scope.currentuserdetail[itr].displayName;
              }
            }
           userParam.user_id= recent.contactIds;
           userParam = JSON.stringify(userParam);  
          $state.go('chatuser',{userDetailParam:userParam},{reload:true});

        }
        else{
          console.log(recent)
            var groupParam = {};
            groupParam.group_id = recent.groupId; 
            var itr=0;
            for(itr in $scope.currentgroupdetail)
            {
              if(recent.groupId == $scope.currentgroupdetail[itr].id)
              {
                groupParam.block_name = $scope.currentgroupdetail[itr].name;
                groupParam.admin_id = parseInt($scope.currentgroupdetail[itr].adminName);
              }
            }
            var groupParams = JSON.stringify(groupParam);
           console.log(groupParams)
           $state.go('chatuser',{groupDetailParam:groupParams},{reload:true});
        }
        $scope.isLoading = false;
    };
     getOtherUserDetail();
};
