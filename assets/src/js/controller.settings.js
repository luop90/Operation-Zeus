zeus.controller('SettingPageCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.settings = $rootScope.settings;
  $scope.settings.darkTheme = !$scope.settings.lightTheme;

  $scope.saveSettings = function () {
    $rootScope.settings = {
      lightTheme: !$scope.settings.darkTheme,
      animations: $scope.settings.animations,
      analytics: $scope.settings.analytics,
      autoplay: $scope.settings.autoplay,
      volume: $scope.settings.volumeRange
    };

    Zeus.saveSettings($rootScope.settings);
  };
}]);
