var zeus = angular.module('zeus', [
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/podcast/:id', {
        templateUrl: 'partials/podcast.html'
      });

    $locationProvider.html5Mode(false);
  }]);
