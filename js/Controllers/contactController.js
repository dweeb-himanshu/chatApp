"use strict";
//contact controller contacts loading..
angular.module("chatApp")
  .controller('contactCtrl', contactCtrl);
/*
*@function: This is controller function for contacts page.
*/
function contactCtrl($scope, $rootScope,$timeout, $location,$http,chatService,$state) {
  $scope.blockName = "All";
  $scope.blockLimit = 2;
  $scope.contactLimit = 10;
  $scope.current =  JSON.parse(localStorage.getItem("userDetails"));
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
  function init(){
    $scope.blockdetail = [];
  }
    $timeout(function() {
      $scope.blockLimit = 100;
      $scope.contactLimit = 500;
    }, 1000);

    function getApplozicContacts()
    {
     var AuthorizationCode = 'Basic '+Code;
      
      $http({
                  url: 'https://apps.applozic.com/rest/ws/user/filter?startTime=0&pageSize=500',
                  method: "GET",
                  headers: {
                "Authorization": AuthorizationCode,
                "UserId-Enabled": true,
                "Application-Key": "31b9e5c457ead58f874571e5ce7eb730",
                "Device-Key": $scope.applozicCred.data.deviceKey
        }
              })
              .then(function(response) {
              console.log(response);
              }, 
              function(response) { // optional
                      // failed
              });
    }
    function getallContacts()
    {
      init();
        chatService.getallContact($scope.current.user_id, $scope.current.apartment_id)
            .then(function(response){
              console.log(response);
              getApplozicContacts();
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
