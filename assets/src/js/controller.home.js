zeus.controller('HomePageCtrl', function ($scope, $rootScope, $timeout) {
  $scope.podcasts = [];

  $scope.addNewPodcast = function () {
    addPodcast('http://www.hellointernet.fm/podcast?format=rss', function (err, podcast) {
      if (err) {
        return;
      }

      $scope.podcasts.push(podcast);
    });
  };
});
