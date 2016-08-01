angular
  .module('zeus')
  .run(runBlock);

function runBlock($window, $rootScope, $location) {
  $rootScope.darkTheme = true;
  $rootScope.podcasts = [];

  Zeus.loadSettings(function (data) {
    $rootScope.settings = data;
    $rootScope.fullyLoaded = true;
  });
}
