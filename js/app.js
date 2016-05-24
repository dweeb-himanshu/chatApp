
angular.module('chatApp',['ionic','ngRoute','ngResource','angular.filter','angular-toArrayFilter']);
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
