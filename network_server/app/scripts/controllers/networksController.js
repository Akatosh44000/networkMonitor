angular.module('networkServerApp').controller('networksController', 
		function($interval,$scope,$location,$http,socket,networksProbeService) {
    
	parseData=function(networks){
		for (var i = 0; i < networks.length; i++) {
			if(networks[i].network_status=='off'){
				networks[i].network_color_status='red'
			}else{
				networks[i].network_color_status='green'
			}
		}
		return networks;
  	};
  	
  	retreiveData=function(){
  		$http.get('/getNetworksList').then(function(response){
  			var networks=response.data.networks;
  	        $scope.networksList = parseData(networks);
  		});
  	};
  	
	//LOADING RETRIEVAL
  	retreiveData();

	//RETRIEVAL BY SOCKETIO
    socket.on('PROBE_FROM_SERVER', function (data) {
    	retreiveData();
    });
    
    $scope.showNetwork = function(network_id) {
    	$location.path('network/'+network_id+'/');
	};
      
});


