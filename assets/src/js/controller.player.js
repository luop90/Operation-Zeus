zeus.controller('PlayerPageCtrl', ['$scope', '$rootScope', '$route', '$location', 'ngAudio', function ($scope, $rootScope, $route, $location, ngAudio) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.podcast];
  $scope.episode = $rootScope.podcasts[$route.current.params.podcast].podcasts[$route.current.params.episode];

  $scope.sound = ngAudio.load('../../userdata/podcasts/' + $scope.episode.hash + '.mp3');
  $scope.playback = {
    currentlyPlaying: false,
    lastEpisode: function () {
      $location.url('/play/' + $route.current.params.podcast + '/' + $route.current.params.episode - 1);
    },
    replay10Seconds: function () {
      $scope.sound.currentTime -= 10;
    },
    playPodcast: function () {
      $scope.playback.currentlyPlaying = true;
      $scope.sound.play();
    },
    pausePodcast: function () {
      $scope.playback.currentlyPlaying = false;
      $scope.sound.pause();
    },
    forward30Seconds: function () {
      $scope.sound.currentTime += 30;
    },
    nextEpisode: function () {
      $location.url('/play/' + $route.current.params.podcast + '/' + $route.current.params.episode + 1);
    }
  };

  $('[data-bind="episode.description"]').html($scope.episode.description);
  $('.tooltipped').tooltip({ delay: 50 });
}]);
