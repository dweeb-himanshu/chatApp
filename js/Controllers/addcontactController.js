"use strict";
angular.module("chatApp")
  .controller('addcontactCtrl', addcontactCtrl);
function addcontactCtrl($scope, $rootScope,$http, $location, $stateParams, chatService) {
  $scope.users = [];
  var current = [];
  var applozicUsers =[];
  $scope.block_id = JSON.parse($stateParams.blockIdParam);
  $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  if(!$rootScope.chatContacts){
    current = $rootScope.chatContacts = JSON.parse(localStorage.getItem("groupData"));
    console.log(current)
    console.log("getting from local...");
  }
  else{
      //console.log($rootScope.chatContacts);
      current = $rootScope.chatContacts;
  }
  if(!$rootScope.userInfo){
    $rootScope.userInfo = JSON.parse(localStorage.getItem("userDetails"));
    console.log("getting from local...");
  }
  var blocks = [];
  var users = [];
  $scope.userInfo = [];
  //console.log(current.data.blocks.length);
  for(var i in current.data.blocks){
    blocks[i] = current.data.blocks[i];
    //console.log(current.blocks);
  }
  console.log(blocks[0]);
  for(var j in blocks){
    //console.log(blocks[j]);
    //console.log(blocks[j].users);
    //console.log(blocks[j].users.length);
    for(var k=0; k<blocks[j].users.length; k++){
      //console.log(blocks[j].users[k]);
      if(blocks[j].type==="default"){
          users[k] = blocks[j].users[k];
          //console.log(k+" "+users[k]);
      }
    }
  }
  var itr = 0;
  $scope.userInfo[0] = users[0];
  for(var k in users){
    //console.log("Users Length::"+users.length);
    $scope.userInfo[itr] = users[k];
    itr++;
    /*for(var l=0; l<users.length; l++){
      $scope.userInfo[itr] = users[k];
      itr++;
    }*/
  }
  /*Printing the userInfo*/
  /*for(var itr in $scope.userInfo){
    console.log(itr+" "+$scope.userInfo[itr]);
  }*/

  $scope.BacktoEditGroup = function ()
  {
      $location.path('/editgroup');
  };
  $scope.SelectUser = function(event, user_id){
    console.log("selecting user...");
    if(event.target.classList.contains("button-select-user")){
      event.target.classList.remove("button-select-user");
      event.target.classList.add("button-select-user-activated");
      
      $scope.users.push({
        user_id: user_id
      });
      applozicUsers.push(user_id);
      console.log(applozicUsers);
    }
    else{
      event.target.classList.remove("button-select-user-activated");
      event.target.classList.add("button-select-user");
      var i = 0, loc = 0;
      for(i=0; i<$scope.users.length; i++){
        if($scope.users[i].user_id == user_id){
          loc = i;
        }
      }
      for(i=loc; i<$scope.users.length; i++){
        $scope.users[i] = $scope.users[i+1];
      }
      $scope.users.length--;
    }

  };
  $scope.SetGroup = function(){
    console.log($scope.block_id.group_id);
    var addUsersGroup = {
      user_id: $rootScope.userInfo.user_id,
      apartment_id: $rootScope.userInfo.apartment_id,
      block_id: $scope.block_id.block_id,
      users: $scope.users
    };
    chatService.postUsersGroup(addUsersGroup)
      .success(function(response){
        console.log(response);
        window.localStorage["groupData"] = angular.toJson(response);
        appLoziaddmember();
        
      })
      .error(function(err){
        console.log(err);
      });               
  }
  function appLoziaddmember()
        {
          alert($scope.block_id.group_id);
          $http({
                  url: 'https://apps.applozic.com/rest/ws/group/add/member',
                  method: "GET",
                  headers: {
                    "Authorization": AuthorizationCode,
                    "UserId-Enabled": true,
                    "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                    "Device-Key": $scope.applozicCred.data.deviceKey
                },
                  data: { 
                    'groupId' : $scope.block_id.group_id,
                    'userId' : applozicUsers
                }
              })
              .then(function(response) {
              $location.path('/group');
              }, 
              function(response) { // optional
                      // failed
              });
        }
};
