zeus.controller('SettingPageCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.settings = $rootScope.settings;

  $scope.saveSettings = function () {
    // switch ($('input[type="radio"][name="playbackType"]:checked').attr('id')) {
    //   case 'stream':
    //
    //     break;
    //   default:
    //     $scope.settings.playbackType =
    // }

    $rootScope.settings = {
      darkTheme: $scope.settings.darkTheme,
      animations: $scope.settings.animations,
      analytics: $scope.settings.analytics,
      autoplay: $scope.settings.autoplay,
      volume: $scope.settings.volumeRange,
      cacheImages: $scope.settings.cacheImages
      // playbackType:
    };

    Zeus.saveSettings($rootScope.settings);
  };
}]);
