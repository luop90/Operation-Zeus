zeus.controller('PlayerPageCtrl', ['$scope', '$rootScope', '$route', '$location', '$interval','ngAudio', function ($scope, $rootScope, $route, $location, $interval, ngAudio) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.podcast];
  $scope.episode = $rootScope.podcasts[$route.current.params.podcast].podcasts[$route.current.params.episode];
  $scope.episode.watched = true;

  $scope.sound = ngAudio.load('../../userdata/podcasts/' + $scope.episode.hash + '.mp3');
  $scope.sound.currentTime = $scope.episode.currentTime;  // Load saved time

  $scope.playback = {
    currentlyPlaying: false,
    hoverTime: '0:00:00',
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipWidth: 0,
    tooltipHeight: 0,
    showHoverPosition: false,
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
    },
    goToPosition: function (e) {
      var totalWidth = document.getElementsByClassName('progress')[0].clientWidth;
      var clickedAt = e.offsetX;

      var percent = (clickedAt / totalWidth).round(4);
      $scope.sound.currentTime = Math.round(($scope.sound.remaining + $scope.sound.currentTime) * percent);
    },
    showPosition: function (e) {
      var totalWidth = document.getElementsByClassName('progress')[0].clientWidth;
      var clickedAt = e.offsetX;

      var percent = (clickedAt / totalWidth).round(4);
      $scope.playback.hoverTime = parseTime(Math.floor(($scope.sound.remaining + $scope.sound.currentTime) * percent));

      $scope.playback.tooltipLeft = e.pageX - 20;
      $scope.playback.tooltipTop = $('.progress').position().top - 10;
      $scope.playback.showHoverPosition = true;
    }
  };

  var updateTime = $interval(function () {
    $scope.episode.currentTime = $scope.sound.currentTime;
    Zeus.updateSavedPodcast($scope.podcast);
  }, 1000 * 30);

  $('[data-bind="episode.description"]').html($scope.episode.description);
  $('.tooltipped').tooltip();
}]);

function parseTime(input) {
  var totalSec = input;
  var output = '';
  var hours = 0;
  var minutes = 0;
  var seconds = 0;

  if (totalSec > 3599) {
      hours = Math.floor(totalSec / 3600);
      minutes = Math.floor((totalSec - (hours * 3600)) / 60);
      seconds = (totalSec - ((minutes * 60) + (hours * 3600)));
      if (hours.toString().length == 1) {
          hours = '0' + (Math.floor(totalSec / 3600)).toString();
      }
      if (minutes.toString().length == 1) {
          minutes = '0' + (Math.floor((totalSec - (hours * 3600)) / 60)).toString();
      }
      if (seconds.toString().length == 1) {
          seconds = '0' + (totalSec - ((minutes * 60) + (hours * 3600))).toString();
      }
      output = hours + ':' + minutes + ':' + seconds;
  } else if (totalSec > 59) {
      minutes = Math.floor(totalSec / 60);
      seconds = totalSec - (minutes * 60);
      if (minutes.toString().length == 1) {
          minutes = '0' + (Math.floor(totalSec / 60)).toString();
      }
      if (seconds.toString().length == 1) {
          seconds = '0' + (totalSec - (minutes * 60)).toString();
      }
      output = minutes + ':' + seconds;
  } else {
      seconds = totalSec;
      if (seconds.toString().length == 1) {
          seconds = '0' + (totalSec).toString();
      }
      output = (totalSec < 10 ? '0:00:0' : '0:00:') + totalSec;
  }

    return output;
}
