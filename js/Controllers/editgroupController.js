"use strict";
angular.module("chatApp")
  .controller('editgroupCtrl', editgroupCtrl);
function editgroupCtrl($http,$scope, $rootScope, $location, $window, $stateParams, $state, chatService) {
  $scope.blockData = JSON.parse($stateParams.blockDataParam);
  console.log($scope.blockData);
  /*
   * Set data in rootscope when we are getting data through url parameter,
   * so that it can reused when we come back from next page, when there would be no
   * url parameter to provide data.
   */
   $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  if($scope.blockData == null || $scope.blockData == ''){
    console.log("No data in scope");
    $scope.blockData = $rootScope.blockData;
  }
  else{
    $rootScope.blockData = $scope.blockData;
  }
  $scope.users = [];

  $scope.BacktoEditGroup = function ()
  {
      var blockDataJson = JSON.stringify($scope.blockData);
      $state.go('groupwiseuser', {blockDataParam: blockDataJson });
  }
  $scope.addContact = function ()
  {
      console.log($scope.blockData);  
       $scope.blockId={};
      $scope.blockId.blockId = $scope.blockData.block_id;
      $scope.blockId.group_id = $scope.blockData.group_id;
      var blockData = JSON.stringify($scope.blockId);
      $state.go('addcontact',{blockIdParam:blockData});
  }
  $scope.SetGroup = function()
  {
    console.log($scope.blockData);
      if($scope.users.length>0){
        /*Getting info of current user*/
        var currentUser = JSON.parse(localStorage.getItem("userDetails"));
        var users = [];
        var applozicUsers =[];
        var itr = 0;
        console.log($scope.users);
        for(itr in $scope.users){
          applozicUsers.push($scope.users[itr]);
          users.push({
            user_id: $scope.users[itr]
          });
        };
        var updateGroupData = {
          user_id: currentUser.user_id,
          apartment_id: currentUser.apartment_id,
          block_id: $scope.blockData.block_id,
          users: users
        };
        console.log(applozicUsers);
        //create new applozic group
              $http({
                  url: 'https://apps.applozic.com/rest/ws/group/remove/member',
                  method: "GET",
                  headers: {
                    "Authorization": AuthorizationCode,
                    "UserId-Enabled": true,
                    "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                    "Device-Key": $scope.applozicCred.data.deviceKey
                },
                  data: { 
                    'groupId' : $scope.blockData.group_id,
                    'userId' : applozicUsers
                }
              })
              .then(function(response) {
              console.log(response);
              }, 
              function(response) { // optional
                      // failed
              });
        chatService.postUpdateGroup(updateGroupData)
          .success(function(response){
              console.log(response);
              window.localStorage["groupData"] = angular.toJson(response);
              $location.path('/group');
          })
          .error(function(err){
            console.log(err);
          })
        }
      else{
        alert("Please select the members to be removed");
      }
  }

  $scope.SelectUser = function(event, user_id){
    console.log("Selected..."+event.target);
    if(event.target.classList.contains("button-select-user-activated")){
      event.target.classList.remove("button-select-user-activated");
      event.target.classList.add("button-select-user");
      $scope.users.push(user_id);
      console.log("unchecked");
    }
    else{
      console.log("checked");
      event.target.classList.remove("button-select-user");
      event.target.classList.add("button-select-user-activated");
      var i = 0, loc = 0;
      for(i=0; i<$scope.users.length; i++){
        if($scope.users[i] == user_id){
          loc = i;
        }
      }
      for(i=loc; i<$scope.users.length; i++){
        $scope.users[i] = $scope.users[i+1];
      }
      $scope.users.length--;
    }
    /*Printing users list - for debugging only*/
    for(i in $scope.users){
      console.log($scope.users[i]);
    }
  };
};
