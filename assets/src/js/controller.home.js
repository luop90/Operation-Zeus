zeus.controller('HomePageCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
  $scope.podcasts = $rootScope.podcasts;
  $('button.modal-trigger').leanModal();
  $('.tooltipped').tooltip({
    delay: 50
  });

  $scope.openPodcastModal = function () {
    Materialize.updateTextFields();
    $('.modal#addPodcastModal').openModal();
  };

  $scope.addNewPodcast = function (podcastInfo) {
    $scope.podcastInfo.hasError = false;
    $scope.loadingRSSFeed = true;

    if (!podcastInfo.url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)) {
      $scope.podcastInfo.errorMessage = 'Invalid URL';
      $scope.podcastInfo.hasError = true;
      $scope.loadingRSSFeed = false;
      return;
    }

    Zeus.addPodcast(podcastInfo.url, function (err, podcast) {
      if (err || !podcast) {
        $scope.podcastInfo.errorMessage = 'Error: ' + String(err);
        $scope.podcastInfo.hasError = true;
        $scope.loadingRSSFeed = false;
        return;
      }

      // $rootScope.podcasts.push(podcast);
      // var i = $rootScope.podcasts.indexOf(podcast);
      // $rootScope.podcasts[i].id = i;
      $('.modal#addPodcastModal').closeModal();
      // console.log(podcast);

      $scope.podcastInfo.url = '';
      $scope.loadingRSSFeed = false;

      $timeout(function () {
        $scope.loadingPodcasts = false;
        $('.tooltipped').tooltip({
          delay: 50
        });
      }, 1000);
    });
  };

  $timeout(function () {
    $('.tooltipped').tooltip({
      delay: 50
    });
  }, 500);
}]);
