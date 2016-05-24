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
            console.log(blockData.id);
            var blockDataJson ={};
             blockDataJson.group_id = blockData.id;
             blockDataJson.block_name = blockData.name;
            blockDataJson = JSON.stringify(blockDataJson);
           $state.go('chatuser', {groupDetailParam: blockDataJson });
    };
    /*
    * Redirects to show the group member details.
    *@param {json} blockData - Data related to group which is selected.
    */
    $scope.expandGroup = function (blockData)
      {
        blockData.group_id = blockData.id;
        var blockDataJson = JSON.stringify(blockData);
        console.log(blockDataJson);
        $state.go('groupwiseuser', {blockDataParam: blockDataJson},{reload:true});
    };
          $http({
                  url: 'https://apps.applozic.com/rest/ws/group/list',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "1fedfc0bd75571dd2426318ef00dc2a39",
                "Device-Key": $scope.applozicCred.data.deviceKey
        }
              })
              .then(function(response) {
                console.log(response);
                var itr = 0;
              $scope.ApplozicGroupdetail = response;
              }, 
              function(response) { // optional
                      // failed
              });
};
