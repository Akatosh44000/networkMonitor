angular.module('networkServerApp').controller('networksController', 
		function($scope,$location,socket,networkInfoService,clientAPIService) {
   
  	
    (function init() {
    	clientAPIService.sendRequestToServer('getNetworksList',{});
    })();
  	$scope.sendRequestToServer=clientAPIService.sendRequestToServer;
  	socket.offAll('MESSAGE_FROM_SERVER_TO_CLIENT')
	//RETRIEVAL BY SOCKETIO
    socket.on('MESSAGE_FROM_SERVER_TO_CLIENT', function (message) {
    	if(message.name=='networksList'){
    		$scope.networksList=networkInfoService.parseNetworksData(message.data.networksList)
    	}
    });
    
    $scope.showNetwork = function(network_id) {
    	$location.path('network/'+network_id+'/');
	};
      
});


