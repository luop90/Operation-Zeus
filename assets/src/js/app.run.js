angular
  .module('zeus')
  .run(runBlock);

function runBlock($window, $rootScope, $location) {
  $rootScope.darkTheme = true;
  $rootScope.podcasts = [];

  Zeus.loadSettings(function (data) {
    if (data.darkTheme === undefined) {
      $rootScope.settings = {
        darkTheme: true,
        animations:  true,
        analytics:  true,
        autoplay:  false,
        volume: 50,
        cacheImages: true
      };
    } else {
      $rootScope.settings = data;
    }

    Zeus.loadSavedPodcasts(function (data) {
      console.log(data);
      $rootScope.podcasts = data;
      $rootScope.fullyLoaded = true;
    });
  });
}
