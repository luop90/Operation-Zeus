angular
  .module('zeus')
  .run(runBlock);

function runBlock($window, $rootScope, $location) {
  $rootScope.darkTheme = true;
  $rootScope.podcasts = [];
}
