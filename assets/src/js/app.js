var podcast = angular.module('podcast', [
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      });

    $locationProvider.html5Mode(false);
  }]);
