zeus.controller('HomePageCtrl', function ($scope, $rootScope, $timeout) {
  $('button.modal-trigger').leanModal();

  $scope.podcasts = [];

  $scope.openPodcastModal = function () {
    $('.modal#addPodcastModal').openModal();
  };

  $scope.addNewPodcast = function (podcastInfo) {
    addPodcast(podcastInfo.url, function (err, podcast) {
      if (err) {
        return;
      }

      $scope.podcasts.push(podcast);
      $('.modal#addPodcastModal').closeModal();
    });
  };
});
