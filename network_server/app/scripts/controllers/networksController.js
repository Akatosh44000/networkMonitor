angular.module('networkServerApp').controller('networksController', function($scope,networksProbeService) {
    $scope.greeting = networksProbeService.getProbe();
});


