zeus.controller('PodcastPageCtrl', ['$scope', '$rootScope', '$route', '$location', '$timeout', function ($scope, $rootScope, $route, $location, $timeout) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.id];
  $scope.showUnplayedOnly = true;
  if (!$scope.podcast) {
    $location.url('/');
    return;
  }

  for (var i = 0; i < $scope.podcast.podcasts.length; i++) {
    $scope.podcast.podcasts[i].downloading = false;
  }

  $scope.downloadEpisode = function (id) {
    console.log(id);
    $scope.podcast.podcasts[id].downloading = true;
    $scope.podcast.podcasts[id].downloadPercent = 0;

    Zeus.downloadEpisode($scope.podcast.podcasts[id], function (error, success, percent) {
      $scope.podcast.podcasts[id].downloadPercent = 100;
      clearInterval(updateInterval);
    });

    var updateInterval = setInterval(function () {
      $scope.podcast.podcasts[id].downloadPercent ++;
    }, 100);
  };

  $scope.deleteEpisode = function (id) {
    Zeus.deleteEpisode($scope.podcast.podcasts[id], function (success) {
      if (success) {
        $scope.podcast.podcasts[id].isDownloaded = false;
      }
    });
  };

  $scope.playPodcast = function (podcast, episode) {
    if ($scope.podcast.podcasts[episode].isDownloaded) {
      $location.url('/play/' + podcast + '/' + episode);
    }
  };

  $scope.markAsWatched = function (id) {
    $scope.podcast.podcasts[id].watched = true;
    Zeus.updateSavedPodcast($scope.podcast);
  };

  $('ul.tabs').tabs();
}]);
