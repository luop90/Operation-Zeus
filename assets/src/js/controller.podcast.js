zeus.controller('PodcastPageCtrl', ['$scope', '$rootScope', '$route', '$location', function ($scope, $rootScope, $route, $location) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.id];
  $scope.showUnplayedOnly = true;
  if (!$scope.podcast) {
    $location.url('/');
  }

  $scope.downloadEpisode = function (id) {
    console.log(id);
    $scope.podcast.podcasts[id].downloading = true;
    $scope.podcast.podcasts[id].downloadPercent = 0;
  };

  $scope.deleteEpisode = function (id) {

  };

  $('ul.tabs').tabs();
}]);
