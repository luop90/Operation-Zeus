zeus.controller('HomePageCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
  $('button.modal-trigger').leanModal();

  $scope.podcasts = [];

  $scope.openPodcastModal = function () {
    Materialize.updateTextFields();
    $('.modal#addPodcastModal').openModal();
  };

  $scope.addNewPodcast = function (podcastInfo) {
    $scope.loadingRSSFeed = true;

    addPodcast(podcastInfo.url, function (err, podcast) {
      if (err || !podcast) {
        $scope.podcastInfo.errorMessage = 'Error: ' + String(err);
        $scope.podcastInfo.hasError = true;
        $scope.loadingRSSFeed = false;
        return;
      }

      $scope.podcasts.push(podcast);
      $('.modal#addPodcastModal').closeModal();

      $scope.podcastInfo.url = '';
      $scope.loadingRSSFeed = false;

      $timeout(function () {
        $scope.loadingPodcasts = false;
      }, 1000);
    });
  };
}]);
