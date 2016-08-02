zeus.controller('PlayerPageCtrl', ['$scope', '$rootScope', '$route', function ($scope, $rootScope, $route) {
  $scope.episode = $rootScope.podcasts[$route.current.params.podcast].podcasts[$route.current.params.episode];

  $scope.playback = {
    timePassed: '0:00:00',
    timeLeft: $scope.episode.podcastLengthParsed,
    percentPlayedOutput: '0%',
    currentlyPlaying: false,
    lastEpisode: function () {

    },
    replay10Seconds: function () {

    },
    playPodcast: function () {
      $scope.playback.currentlyPlaying = true;
    },
    pausePodcast: function () {
      $scope.playback.currentlyPlaying = false;
    },
    forward30Seconds: function () {

    },
    nextEpisode: function () {

    }
  };

  $('[data-bind="episode.description"]').html($scope.episode.description);
  $('.tooltipped').tooltip({ delay: 50 })
}]);
