"use strict";
angular.module("chatApp")
  .controller('groupCtrl', groupCtrl);
  function groupCtrl($scope, $rootScope, chatService, $location, $state) {
    $rootScope.isConatct ='3'
    var current = [];
    var itr = 0;
    var counter = 0;
    var counter1 = 0;
    $scope.defaultBlocks = [{}];
    $scope.personalBlocks = [];
    console.log("$rootScope.userInfo "+$rootScope.userInfo+ "$rootScope.groupContacts "+$rootScope.groupContacts);

    if($rootScope.userInfo === undefined || $rootScope.userInfo === null){
      $rootScope.userInfo = JSON.parse(localStorage.getItem("userDetails"));
    }
    if($rootScope.groupContacts === undefined || $rootScope.groupContacts === null){
      chatService.getGroupData($rootScope.userInfo.user_id, $rootScope.userInfo.apartment_id)
        .then(function(response){
          current = $rootScope.groupContacts = response;
          window.localStorage["groupData"] = angular.toJson(response);
          console.log(response);
          separateGroups();
        });
      }
      else{
        console.log("Taking group data from local...");
        current = $rootScope.groupContacts = JSON.parse(localStorage.getItem("groupData"));
        separateGroups();
      }
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
        var blockDataJson = JSON.stringify(blockData);
        $state.go('chatuser', {groupDetailParam: blockDataJson });
    };
    /*
    * Redirects to show the group member details.
    *@param {json} blockData - Data related to group which is selected.
    */
    $scope.expandGroup = function (blockData)
    {
      var blockDataJson = JSON.stringify(blockData);
      //console.log(blockDataJson);
      $state.go('groupwiseuser', {blockDataParam: blockDataJson})
    };

};
