
//this is login controller
var app = angular.module("chatApp");
  app.controller('loginwebCtrl',['$http','$state','$scope', '$window','chatService','$rootScope', '$location', '$ionicPopup',function($http,$state,$scope, $window, chatService, $rootScope,$location,$ionicPopup) {
   
       if(localStorage.getItem("userDetails") == null)
    {
      $scope.isUserLoggedIn = false;
      $rootScope.Isloggedin=false;
      $scope.username = null;
      $scope.groupmember = {};
      $scope.password = null;
      $scope.signIn = function (user)
      {
        $scope.isLoading = true;
        //console.log(user.username);    
        chatService.postUserInfo(user)
          .success(function(response){
            console.log(response);
            $rootScope.userDetails = response;
            //check for user authentication
            console.log(response.login_result);
            if(response.login_result == 'fail')
            {
              //ION POPUP FOR INVALID DETAIL
                  $ionicPopup.alert({
                  title: '',
                  content: 'Invalid user name or password'
                }).then(function(res) {
                  //redirect to login
                    $location.path('/login');
                });
            }
            else
            {
                     if($scope.currentuser == null)
                        {
                          console.log(response);
                           $applozic.fn.applozic({
                                            userId: response.user_id,
                                            userName: response.username, 
                                            imageLink:response.profile_image,
                                            appId: '1fedfc0bd75571dd2426318ef00dc2a39',  
                                              ojq: $original,
                                              maxAttachmentSize: 25,
                                              notification:false, 
                                              desktopNotification: false,
                                              locShare: false,
                                              googleApiKey: "AIzaSyBMK0uA1DYVLWFrtd8l3T-hb5t7vzf_M_M",
                                              onInit: function() { 
                                                 $applozic.fn.applozic('subscribeToEvents',  {
                                                  onMessageReceived : function(data)
                                                    {
                                                      console.log(data);
                                                      $rootScope.getrecentChat();
                                                    } 

                                                });
                                                enablePushnotification();
                                                     }
                                         });
                        }
              window.localStorage["userDetails"] = angular.toJson(response);
              $rootScope.Isloggedin=true;
              /*This flag will ensure that userData API in chatController is called
              only once.
              */
              $scope.current = JSON.parse(localStorage.getItem("userDetails"));
              //geting device key from applozic
             
              $http({
                  url: 'https://apps.applozic.com/rest/ws/register/client',
                  method: "POST",
                  data: { 
                    'userId' : $scope.current.user_id,
                    'displayName':$scope.current.username,
                    'imageLink':$scope.current.profile_image,
                    'applicationId':'1fedfc0bd75571dd2426318ef00dc2a39',
                    'deviceType':1

                }
              })
              .then(function(response) {
              window.localStorage["applozicDetails"] = angular.toJson(response);
              getAuthCode();
              }, 
              function(response) { // optional
                      // failed
              });
              function getAuthCode() {
              $scope.applozicCred =  JSON.parse(localStorage.getItem("applozicDetails"));

  var Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }

}
  var Code = Base64.encode($scope.applozicCred.config.data.userId+':'+$scope.applozicCred.data.deviceKey);
  $scope.AuthorizationCode = 'Basic '+Code;  
  window.localStorage["AuthorizationCode"] = $scope.AuthorizationCode;
  goToChat();
}
              function enablePushnotification()
              {
                $rootScope.GCM_REGISTRATION_ID = localStorage.getItem("GCM_DETAIL");
                console.log($rootScope.GCM_REGISTRATION_ID);
                var userPxy = {
                          'applicationId': '1fedfc0bd75571dd2426318ef00dc2a39', 
                          'userId': $scope.current.user_id, 
                          'registrationId': $rootScope.GCM_REGISTRATION_ID,
                          'pushNotificationFormat' : '1',
                          'appVersionCode': '106'
                        };

                      $.ajax({
                        url: "https://apps.applozic.com/rest/ws/register/client",
                              type: 'post',
                              data: JSON.stringify(userPxy),
                              contentType: 'application/json',
                              headers: {'Application-Key': '1fedfc0bd75571dd2426318ef00dc2a39'}, 
                                  success: function (result) {
                                    console.log(result);
                                  }
                      });
              }

            }
          })
          .error(function(err){
            console.error(err);
          });
      };
      function goToChat()
               { 
              $rootScope.apiCallFlag = false;
              $location.path('/chat');
            }
    }
    else {
      $scope.isUserLoggedIn = true;
      var currentuser = JSON.parse(localStorage.getItem("userDetails"));

                   $applozic.fn.applozic({
                        userId: currentuser.user_id,
                        userName: currentuser.username, 
                        imageLink:currentuser.profile_image,
                        appId: '1fedfc0bd75571dd2426318ef00dc2a39',  
                          ojq: $original,
                          maxAttachmentSize: 25, 
                          notification:false, 
                          desktopNotification: false,
                          locShare: false,
                          googleApiKey: "AIzaSyBMK0uA1DYVLWFrtd8l3T-hb5t7vzf_M_M",
                          onInit: function() { 
                            console.log('oninit called');
                                    $applozic.fn.applozic('subscribeToEvents',  {
                                                  onMessageReceived : function(data)
                                                    {
                                                      console.log(data);
                                                      $rootScope.getrecentChat();
                                                    } 

                                                });
                                    
                           goToChat();
                                 }
                     });
            function goToChat()
            {
               console.log('sdf');
               $rootScope.Isloggedin=true;
                $state.go('chat', {},{reload:true});
            }
          }
  }]);
