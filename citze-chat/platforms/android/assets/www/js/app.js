
angular.module('chatApp',['ionic','ngRoute','ngCordova','ngResource','angular.filter','angular-toArrayFilter']);
angular.module('chatApp')
.config(function($stateProvider,$urlRouterProvider, $ionicConfigProvider){
      $stateProvider

        .state('login',{url:'/login',templateUrl:'templates/login.html',cache:false,controller:'loginwebCtrl'})
            .state('chat',{url:'/chat',templateUrl:'templates/chat.html',cache:false,controller:'chatCtrl'})
            .state('chatuser',{url:'/chatuser',params: { userDetailParam: null, cache:false,groupDetailParam: null},templateUrl:'templates/chatuser.html',controller:'chatuserCtrl'})
            .state('group',{url:'/group',templateUrl:'templates/group.html',cache:false,controller:'groupCtrl'})
            .state('contact',{url:'/contact',templateUrl:'templates/contact.html',cache:false,controller:'contactCtrl'})
            .state('addgroup',{url:'/addgroup',templateUrl:'templates/addgroup.html',cache:false,controller:'addgroupCtrl'})
            .state('groupwiseuser',{url:'/groupwiseuser',params:{ blockDataParam: null},cache:false,templateUrl:'templates/groupwiseuser.html',controller:'groupwiseuserCtrl'})
            .state('editgroup',{url:'/editgroup', params:{blockDataParam: null},cache:false,templateUrl:'templates/editgroup.html',controller:'editgroupCtrl'})
            .state('addcontact',{url:'/addcontact', params:{blockDataParam: null},cache:false,templateUrl:'templates/addcontact.html',controller:'addcontactCtrl'})

     $urlRouterProvider.otherwise('/login');
  });
angular.module('chatApp').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });
angular.module('chatApp').run(function($cordovaPush,$rootScope) {

  var androidConfig = {
    "senderID": "49466468971",
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
    }, function(err) {
      // Error
    })

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            $rootScope.GCM_REGISTRATION_ID = notification.regid;
            console.log($rootScope.GCM_REGISTRATION_ID);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          console.log('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          console.log('GCM error = ' + notification.msg);
          break;

        default:
          console.log('An unknown GCM event has occurred');
          break;
      }
    });


    // // WARNING: dangerous to unregister (results in loss of tokenID)
    // $cordovaPush.unregister(options).then(function(result) {
    //   // Success!
    // }, function(err) {
    //   // Error
    // })

  }, false);
});



