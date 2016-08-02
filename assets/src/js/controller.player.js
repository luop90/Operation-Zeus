zeus.controller('PlayerPageCtrl', ['$scope', '$rootScope', '$route', function ($scope, $rootScope, $route) {
  $scope.episode = $rootScope.podcasts[$route.current.params.podcast].podcasts[$route.current.params.episode];

  $('[data-bind="episode.description"]').html($scope.episode.description);
}]);
