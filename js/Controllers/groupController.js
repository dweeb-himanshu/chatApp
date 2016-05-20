"use strict";
angular.module("chatApp")
  .controller('groupCtrl', groupCtrl);
  function groupCtrl($scope, $rootScope, chatService,$http, $location, $state) {
    $rootScope.isConatct ='3'
    var current = [];
    var itr = 0;
    var counter = 0;
    var counter1 = 0;
    $scope.defaultBlocks = [{}];
    $scope.personalBlocks = [];
    $scope.currentuser = JSON.parse(localStorage.getItem("userDetails"));
    $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  $scope.defaultGroupid  = localStorage.getItem("DefaultGroupid");
      chatService.getGroupData($scope.currentuser.user_id, $scope.currentuser.apartment_id)
        .then(function(response){
          current = $rootScope.groupContacts = response;
          window.localStorage["groupData"] = angular.toJson(response);
          console.log(response);
          separateGroups();
        });
      function separateGroups(){
        if(current !== null && current !== undefined){
          if(current.data == undefined){
            for(itr in current.blocks){
            console.log(current.blocks[itr].block_name);
            if(current.blocks[itr].type === "default"){
              $scope.defaultBlocks[counter] = current.blocks[itr];
              counter++;
            }
            if(current.blocks[itr].type === "personal"){
              console.log("personal::"+current.blocks[itr].block_id);
              $scope.personalBlocks[counter1] = current.blocks[itr];
              counter1++;
            }
          }
        }
          else{
            for(itr in current.data.blocks){
            console.log(current.data.blocks[itr].block_name);
            if(current.data.blocks[itr].type === "default"){
              $scope.defaultBlocks[counter] = current.data.blocks[itr];
              //$scope.defaultBlocks[counter].block_name = current.data.blocks[itr].block_name;
              counter++;
            }
            if(current.data.blocks[itr].type === "personal"){
              console.log("personal::"+current.data.blocks[itr].block_id);
              $scope.personalBlocks[counter1] = current.data.blocks[itr];
              //$scope.personalBlocks[0].block_name = current.data.blocks[itr].block_name;
              counter1++;
            }
          }
        }
      }
    };
      $scope.BacktoChat = function ()
    {
        $location.path('/chat');
    };
    $scope.CreateGroup = function ()
    {
        $location.path('/addgroup');
    };
    /*
    *Redirect to group chat.
    *@param {json} blockData - The data related to block which is selected.
    */
    $scope.changePath = function (blockData)
    {

        console.log($scope.ApplozicGroupdetail);
        
        console.log(blockData);
        var itr = 0;
        for(itr in $scope.ApplozicGroupdetail.data.response)
        {
        
          if($scope.ApplozicGroupdetail.data.response[itr].name == blockData.block_name)
          {
            blockData.group_id = $scope.ApplozicGroupdetail.data.response[itr].id;
        }
      }
      var blockDataJson = JSON.stringify(blockData);
        $state.go('chatuser', {groupDetailParam: blockDataJson });
    };
    /*
    * Redirects to show the group member details.
    *@param {json} blockData - Data related to group which is selected.
    */
    $scope.expandGroup = function (blockData)
    {
        for(itr in $scope.ApplozicGroupdetail.data.response)
        {
        
          if($scope.ApplozicGroupdetail.data.response[itr].name == blockData.block_name)
          {
            blockData.group_id = $scope.ApplozicGroupdetail.data.response[itr].id;
        }
      }
      var blockDataJson = JSON.stringify(blockData);
      //console.log(blockDataJson);
      $state.go('groupwiseuser', {blockDataParam: blockDataJson})
    };
          $http({
                  url: 'https://apps.applozic.com/rest/ws/group/list',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        }
              })
              .then(function(response) {
              $scope.ApplozicGroup = response;
              $scope.ApplozicGroupdetail = response;
              }, 
              function(response) { // optional
                      // failed
              });
};
