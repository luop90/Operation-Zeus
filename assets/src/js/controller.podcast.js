zeus.controller('PodcastPageCtrl', ['$scope', '$rootScope', '$route', '$location', '$timeout', function ($scope, $rootScope, $route, $location, $timeout) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.id];
  $scope.showUnplayedOnly = true;
  if (!$scope.podcast) {
    $location.url('/');
  }

  $scope.downloadEpisode = function (id) {
    console.log(id);
    $scope.podcast.podcasts[id].downloading = true;
    $scope.podcast.podcasts[id].downloadPercent = 0;

    Zeus.downloadPodcast($scope.podcast.podcasts[id], function (error, success, percent) {
      $scope.podcast.podcasts[id].downloadPercent = 100;
      $scope.podcast.podcasts[id].downloadPercentOutput = $scope.podcast.podcasts[id].downloadPercent + '%';
      clearInterval(updateInterval);
    });

    var updateInterval = setInterval(function () {
      $scope.podcast.podcasts[id].downloadPercent ++;
      $scope.podcast.podcasts[id].downloadPercentOutput = $scope.podcast.podcasts[id].downloadPercent + '%';
    }, 100);
  };

  $scope.deleteEpisode = function (id) {
    Zeus.deleteEpisode($scope.podcast.podcasts[id]);
  };

  $('ul.tabs').tabs();
}]);
