zeus.controller('PodcastPageCtrl', ['$scope', '$rootScope', '$route', '$location', function ($scope, $rootScope, $route, $location) {
  $scope.podcast = $rootScope.podcasts[$route.current.params.id];
  if (!$scope.podcast) {
    $location.url('/');
  }

}]);
