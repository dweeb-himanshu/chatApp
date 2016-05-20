"use strict";
angular.module("chatApp")
  .controller('addgroupCtrl', addgroupCtrl);
  function addgroupCtrl($http,$scope, $rootScope, $location, $window, chatService) {
    $scope.isBlockDisabled = true;
    $scope.newGroupName = null;
    $scope.users = [];
    /**
     * Retrieving the contacts from localStorage
     * then process them and display at view.
     * {Same thing done at contactController.js}
     */
    var current = {};
    if(!$rootScope.groupContacts){
      current = $rootScope.groupContacts = JSON.parse(localStorage.getItem("groupData"));
      console.log("getting from local...");
    }
    else{
        current = $rootScope.groupContacts;
    }
$scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  var defaultGroupname  = localStorage.getItem("DefaultGroup");
    var blocks = [];
    var users = [];
    $scope.userInfo = [];
    //console.log(current.data.blocks.length);
    if(current.data != null && current.data != undefined){
      for(var i in current.data.blocks){
        blocks[i] = current.data.blocks[i];
        //console.log(current.blocks);
      }
    }
    else{
      for(var i in current.blocks){
        blocks[i] = current.blocks[i];
        //console.log(current.blocks);
      }
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
    $scope.changePath = function () {
      if ($scope.isBlockDisabled) {
          $scope.isBlockDisabled = false;
      }
      else {
          $scope.isBlockDisabled = true;
      }
    }
    $scope.setGroup = function ()
    {
        $scope.isBlockDisabled = true;
    }
    /**
     * Take the group name and member id, call the new group API
     */
    $scope.createGroup = function ()
    {

        if($scope.newGroupName != null && $scope.newGroupName != ''){
          if($scope.newGroupName != defaultGroupname)
          {
          if($scope.users.length != 0){
            console.log("users selected::"+$scope.users);
            var users = [];
            var applozicUsers = [];
            var itr = 0;
            for(itr in $scope.users){
              
              applozicUsers.push($scope.users[itr]);
              users.push({
                user_id: $scope.users[itr]
              });
            };
            /*Getting the info of logged user*/
            var currentUser = JSON.parse(localStorage.getItem("userDetails"));
            var newGroupData = {
              user_id: currentUser.user_id,
              apartment_id: currentUser.apartment_id,
              block_name: $scope.newGroupName,
              users: users
            };
            //create new applozic group
              $http({
                  url: 'https://apps.applozic.com/rest/ws/group/create',
                  method: "POST",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        },
                  data: { 
                    'groupName' : $scope.newGroupName,
                    'groupMemberList' : applozicUsers
                }
              })
              .then(function(response) {
              console.log(response);
              }, 
              function(response) { // optional
                      // failed
              });
            chatService.postNewGroup(newGroupData)
              .success(function(response){
                console.log(response);
                window.localStorage["groupData"] = angular.toJson(response);
                $location.path('/group');
              })
              .error(function(err){
                console.log(err);
              });
          }
          else{
            alert("Please select group members");
          }
        }
        else
        {
          alert("Group name can not be same as default");
        }
        }
        else{
          alert("Please enter group name...");
        }

    };

    $scope.BacktoGroup = function ()
    {
        $location.path('/group');
    };

    $scope.SelectUser = function(event, user_id){
      console.log("Selecting user..."+event.target);
      if(event.target.classList.contains("button-select-user")){
          console.log(user_id+" added to list");
          event.target.classList.remove("button-select-user");
          event.target.classList.add("button-select-user-activated");
          $scope.users.push(user_id);
      }
      else{
        console.log("Removing user..."+user_id);
        event.target.classList.remove("button-select-user-activated");
        event.target.classList.add("button-select-user");
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
      /*for(i in $scope.users){
        console.log($scope.users[i]);
      }*/
    }
    
};
