
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
    $scope.currentuser = JSON.parse(localStorage.getItem("userDetails"));
    if(window.localStorage["groupData"] == null)
    {
     chatService.getGroupData($scope.currentuser.user_id,$scope.currentuser.apartment_id)
          .success(function(response){
              console.log(response);
              window.localStorage["groupData"] = angular.toJson(response);
              current = JSON.parse(localStorage.getItem("groupData"));
               groupuserdetail();
          })
          .error(function(err){
            console.log(err);
          })
        }
        else
        {
          current = JSON.parse(localStorage.getItem("groupData"));
          groupuserdetail();
        }
  $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));
  var AuthorizationCode = localStorage.getItem("AuthorizationCode");
   function groupuserdetail(){
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
     var itr = 0;
    for(var j in blocks){

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
   // $scope.userInfo[0] = users[0];
   console.log(users);
    for(var k in users){
      //console.log("Users Length::"+users.length);
      
    }
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
          if($scope.users.length != 0){
            $scope.isSpinnerLoading = true;
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
                "Application-Key": "1fedfc0bd75571dd2426318ef00dc2a39",
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
                $scope.isSpinnerLoading = false;
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
    };
    
};
