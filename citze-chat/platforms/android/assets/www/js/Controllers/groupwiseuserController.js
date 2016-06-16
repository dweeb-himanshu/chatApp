
angular.module("chatApp")
  .controller('groupwiseuserCtrl', groupwiseuserCtrl);
function groupwiseuserCtrl($scope,$http, $rootScope, $location, $state, $stateParams,chatService) {

  $scope.isUserOwner = false;
  $scope.Groupuserdetail = {};
  $scope.UserArray = [];
  $scope.blockData = JSON.parse($stateParams.blockDataParam);
  $scope.currentUser = JSON.parse(localStorage.getItem("userDetails"));
  $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  getAdminName(parseInt($scope.blockData.adminName));
  /*
  * Check whether we got the data from url parameter, if we got the data then set it in rootScope
  * also, so that it can be used when we come back from next page(editgroup).
  * This check is used to make the back functionality work smoothly.
   */
    if($scope.blockData != null){
         if($scope.currentUser.user_id == parseInt($scope.blockData.adminName))
          {
            $scope.isUserOwner = true;
          }
    }


  
  function getGroupUserList()
  {
    var itr = 0;
    for(itr in $scope.blockData.membersName)
    {
      $scope.UserArray.push(parseInt($scope.blockData.membersName[itr]));
    }
    getUserdetail();
  }
  function getUserdetail(){
    console.log($scope.applozicCred.data.deviceKey)
      //get group user detail
       $http({
                  url: 'https://apps.applozic.com/rest/ws/user/detail',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Content-Type": "application/json; charset=utf-8",
                "Application-Key": "1fedfc0bd75571dd2426318ef00dc2a39",
                "Device-Key": $scope.applozicCred.data.deviceKey
        },
                  params: { 
                    'userIds' : $scope.UserArray
                }
              })
              .then(function(response) {
                console.log(response);
              $scope.Groupuserdetail  = response.data;
              }, 
              function(response) { // optional
                      // failed
              });
  }

  $rootScope.isConatct='2';
  $scope.BacktoGroup = function ()
  {
      $location.path('/group');
  }
  $scope.editGroup = function ()
  {
      var blockDataJson = JSON.stringify($scope.blockData);
      //console.log(blockDataJson);
      $state.go('editgroup', {blockDataParam: blockDataJson });
  }
  /*
  * Redirects to individual chat for that user.
  *@param user {json} - Data related to user.
  */
  $scope.changePath = function(user)
  {
    user.user_id = user.userId;
    var userJson = JSON.stringify(user);
    $state.go('chatuser', {userDetailParam: userJson});
  }
  console.log($scope.currentUser);

  //function to get admin name of group
  function getAdminName(adminId)
  {
        chatService.getOtherUserInfo(adminId, $scope.currentUser.apartment_id)
            .then(function(response){
              $rootScope.AdminInfo = response.data;
              console.log($rootScope.AdminInfo);
            });
  }
  getGroupUserList();
};
