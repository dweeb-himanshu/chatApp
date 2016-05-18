"use strict";
//contact controller contacts loading..
angular.module("chatApp")
  .controller('contactCtrl', contactCtrl);
/*
*@function: This is controller function for contacts page.
*/
function contactCtrl($scope, $rootScope,$timeout, $location,chatService,$state) {
  $scope.blockName = "All";
  $scope.blockLimit = 2;
  $scope.contactLimit = 10;
  $scope.current =  JSON.parse(localStorage.getItem("userDetails"));
  function init(){
    $scope.blockdetail = [];
  }
    $timeout(function() {
      $scope.blockLimit = 100;
      $scope.contactLimit = 500;
    }, 1000);

    function getallContacts()
    {
      init();
        chatService.getallContact($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              for(var i in response.data.blocks){ 
              $scope.blockdetail[i] = response.data.blocks[i];
            };
            });
    };
     $scope.changePath = function (user)
      {
          var userParam=JSON.stringify(user);
          $applozic.fn.applozic('loadTab', userParam.user_id)
          $state.go("chatuser",{userDetailParam:userParam},{reload: true})
      };
      $scope.BacktoChat = function ()
        {
            $location.path('/chat');
        };
     getallContacts();
};
