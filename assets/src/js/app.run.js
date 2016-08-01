angular
  .module('podcast')
  .run(runBlock);

function runBlock($window, $rootScope, $location) {
  $rootScope.darkTheme = true;
}
