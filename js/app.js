
angular.module('chatApp',['ionic','ngRoute','ngResource','angular.filter','angular-toArrayFilter']);
angular.module('chatApp')
.config(function($stateProvider,$urlRouterProvider, $ionicConfigProvider){
      $stateProvider

        .state('login',{url:'/login',templateUrl:'templates/login.html',controller:'loginwebCtrl'})
            .state('chat',{url:'/chat',templateUrl:'templates/chat.html',controller:'chatCtrl'})
            .state('chatuser',{url:'/chatuser',params: { userDetailParam: null, groupDetailParam: null},templateUrl:'templates/chatuser.html',controller:'chatuserCtrl'})
            .state('group',{url:'/group',templateUrl:'templates/group.html',controller:'groupCtrl'})
            .state('contact',{url:'/contact',templateUrl:'templates/contact.html',controller:'contactCtrl'})
            .state('addgroup',{url:'/addgroup',templateUrl:'templates/addgroup.html',controller:'addgroupCtrl'})
            .state('groupwiseuser',{url:'/groupwiseuser',params:{ blockDataParam: null},templateUrl:'templates/groupwiseuser.html',controller:'groupwiseuserCtrl'})
            .state('editgroup',{url:'/editgroup', params:{blockDataParam: null},templateUrl:'templates/editgroup.html',controller:'editgroupCtrl'})
            .state('addcontact',{url:'/addcontact', params:{blockIdParam: null},templateUrl:'templates/addcontact.html',controller:'addcontactCtrl'})

     $urlRouterProvider.otherwise('/login');
  });
