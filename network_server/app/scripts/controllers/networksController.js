angular.module('networkServerApp').controller('networksController', function($interval,$scope,$http,networksProbeService) {
    //$scope.greeting = networksProbeService.getProbe();
	$interval(function(){$http.get('/getNetworksList').then(function(response){
        $scope.networksList = response.data.networks;
        console.log(response.data.networks)
    });},1000);
});


