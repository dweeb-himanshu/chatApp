
angular.module("chatApp")
  .controller('addcontactCtrl', addcontactCtrl);
function addcontactCtrl($scope,$state, $rootScope,$http, $location, $stateParams, chatService) {
  $scope.users = [];
  var current = [];
  var applozicUsers =[];
  $scope.blockData = JSON.parse($stateParams.blockDataParam);
  console.log($scope.blockData);
  $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
  if(!$rootScope.chatContacts){
    current = $rootScope.chatContacts = JSON.parse(localStorage.getItem("groupData"));
  }
  else{
      //console.log($rootScope.chatContacts);
      current = $rootScope.chatContacts;
  }
  if(!$rootScope.userInfo){
    $rootScope.userInfo = JSON.parse(localStorage.getItem("userDetails"));
  }
  var blocks = [];
  var users = [];
  $scope.userInfo = [];
  //console.log(current.data.blocks.length);
  for(var i in current.blocks){
    blocks[i] = current.blocks[i];
    //console.log(current.blocks);
  }
  var itr = 0;
  for(var j in blocks){
    //console.log(blocks[j]);
    //console.log(blocks[j].users);
    //console.log(blocks[j].users.length);
    for(var k=0; k<blocks[j].users.length; k++){
      //console.log(blocks[j].users[k]);
      if(blocks[j].type==="default"){
          users[k] = blocks[j].users[k];
          $scope.userInfo[itr] = users[k];
    itr++;
          //console.log(k+" "+users[k]);
      }
    }
  }
  /*Printing the userInfo*/
  /*for(var itr in $scope.userInfo){
    console.log(itr+" "+$scope.userInfo[itr]);
  }*/

  $scope.BacktoEditGroup = function ()
  {
      var blockDataJson = JSON.stringify($scope.blockData);
      $state.go('editgroup', {blockDataParam: blockDataJson });
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
    if(applozicUsers.length>0){
    $scope.isSpinnerLoading  = true;
    var currentUser = JSON.parse(localStorage.getItem("userDetails"));
          $http({
                  url: 'https://apps.applozic.com/rest/ws/group/add/member',
                  method: "GET",
                  headers: {
                    "Authorization": AuthorizationCode,
                    "UserId-Enabled": true,
                    "Application-Key": "1fedfc0bd75571dd2426318ef00dc2a39",
                    "Device-Key": $scope.applozicCred.data.deviceKey
                },
                params: { 
                    'groupId' : $scope.blockData.id,
                    'userId' : applozicUsers
                }
              })
              .then(function(response) {
                $scope.isSpinnerLoading  = true;
              $location.path('/group');
              }, 
              function(response) { // optional
                      // failed
              });
            }
            else
            {
              alert('please select atleat one member');
            }
            }
};
