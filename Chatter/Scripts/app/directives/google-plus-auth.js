'use strict';

angular.module('directive.googlePlusAuth', []).
  directive('googlePlusAuth', function () {
      var ending = /\.apps\.googleusercontent\.com$/;

      return {
          restrict: 'E',
          template: '<span class="g-signin"></span>',
          replace: true,
          link: function (scope, element, attrs) {
              attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');

              attrs.$set('data-clientid', attrs.clientid);
              
              var defaults = {
                  callback: 'signinCallback',
                  cookiepolicy: 'single_host_origin',
                  requestvisibleactions: 'http://schemas.google.com/AddActivity',
                  scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                  width: 'wide'
              };

              angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
                  if (!attrs.hasOwnProperty(propName)) {
                      attrs.$set('data-' + propName, defaults[propName]);
                  }
              });
              
              attrs.$observe('language', function (value) {
                  window.___gcfg = {
                      lang: value ? value : 'en'
                  };
              });

              (function () {
                  var po = document.createElement('script');
                  po.type = 'text/javascript';
                  po.async = true;
                  po.src = 'https://apis.google.com/js/client:plusone.js';
                  var s = document.getElementsByTagName('script')[0];
                  s.parentNode.insertBefore(po, s);
              })();
          }
      };
  }).run(['$window', '$rootScope', function ($window, $rootScope) {
      $window.signinCallback = function (authResult) {
          if (authResult && authResult.access_token) {
              $rootScope.$broadcast('event:google-plus-auth-success', authResult);
          } else {
              $rootScope.$broadcast('event:google-plus-auth-failure', authResult);
          }
      };
  }]);



