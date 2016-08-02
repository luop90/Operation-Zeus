var zeus = angular.module('zeus', [
  'ngRoute',
  'ngAudio'
])
.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/podcast/:id', {
        templateUrl: 'partials/podcast.html'
      })
      .when('/settings', {
        templateUrl: 'partials/settings.html'
      })
      .when('/about', {
        templateUrl: 'partials/about.html'
      })
      .when('/podcast/:id', {
        templateUrl: 'partials/podcast.html'
      })
      .when('/play/:podcast/:episode', {
        templateUrl: 'partials/player.html'
      });

    $locationProvider.html5Mode(false);
  }]);

angular
  .module('zeus')
  .directive('podcastPanel', PodcastPanelDirective)
  .directive('preloader', PreloaderDirective)
  .directive('preloaderSmall', PreloaderSmallDirective)
  .directive('preloaderSmallBlue', PreloaderSmallBlueDirective)
  .directive('podcastEpisode', PodcastEpisodeDirective);
