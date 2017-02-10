angular.module('networkServerApp').controller('networksController', function($interval,$scope,$http,networksProbeService) {
    //$scope.greeting = networksProbeService.getProbe();
	$interval(function(){$http.get('/getNetworksList').then(function(response){
		var networks=response.data.networks;
		for (var i = 0; i < networks.length; i++) {
			networks[i].network_time_since=(new Date).getTime()-networks[i].network_time_init;
			networks[i].network_time_update=(new Date).getTime()-networks[i].network_time;
			networks[i].network_time_launch=new Date(networks[i].network_time_init);
			if (networks[i].network_time_update>10000){
				networks[i].status='red';
			}else if(networks[i].network_time_update>5000){
				networks[i].status='orange';
			}else{
				networks[i].status='green';
			}
  		 }
        $scope.networksList = networks;
    });},1000);
});


