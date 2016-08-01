angular
  .module('zeus')
  .run(runBlock);

function runBlock($window, $rootScope, $location) {
  $rootScope.darkTheme = true;
  $rootScope.podcasts = [];

  Zeus.loadSettings(function (data) {
    $rootScope.settings = data;

    Zeus.loadSavedPodcasts(function (data) {
      console.log(data);
      $rootScope.podcasts = data;
      $rootScope.fullyLoaded = true;
    });
  });
}
