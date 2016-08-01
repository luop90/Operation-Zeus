zeus.controller('SettingPageCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  $scope.userSettings = {};

  $scope.saveSettings = function () {
    $rootScope.settings = {
      lightTheme: !$('input#darkTheme').is(':checked'),
      animations: $('input#animationsOn').is(':checked'),
      volume: $('input#volumeRange').val(),
      analytics: $('input#analyticsOn').is(':checked')
    };

    Zeus.saveSettings($rootScope.settings);
  };
}]);
