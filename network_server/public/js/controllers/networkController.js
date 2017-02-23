angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,socket,networkInfoService,clientAPIService,graphService) {
	
	 network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
     var chart=new graphService('',5);
     
     (function init() {
    	 clientAPIService.sendRequestToServer('getNetworkInfoWithId',{'network_id':network_id});
     })();

     socket.offAll('MESSAGE_FROM_SERVER_TO_CLIENT');
     socket.offAll('MESSAGE_FROM_NETWORK_TO_CLIENT');

     socket.on('MESSAGE_FROM_SERVER_TO_CLIENT', function (msg) {
      	 if(msg.name=='networkInfoWithId'){
      		 $scope.network=networkInfoService.parseNetworkData(msg.data.networkInfoWithId);
      		 subscribe($scope.network.network_socket_id)
      	 }
     });
     socket.on('MESSAGE_FROM_NETWORK_TO_CLIENT', function (msg) {
    	if(msg.name=='newEpoch'){
			clientAPIService.sendRequestToNetwork('getParams','',$scope.network.network_socket_id);
		}else if(msg.name=='params'){
			chart.setData(msg.data.params)
			//$scope.myDataSource.dataset[0].data[0].value = msg.data.params[0]*10000;
		}else if(msg.name=='architecture'){
			$scope.network.architecture=msg.data.architecture;
		}
     });
	
     $scope.$on('$locationChangeStart', function(){
    	 clientAPIService.sendRequestToServer('unsubscribeFromNetwork',{'network_socket_id':$scope.network.network_socket_id});
	 });
     
     subscribe = function(network_socket_id){
    	 clientAPIService.sendRequestToServer('subscribeToNetwork',{'network_socket_id':network_socket_id});
    	 clientAPIService.sendRequestToNetwork('getNetworkArchitecture','',network_socket_id);
     }
     
     $scope.sendRequestToNetwork=clientAPIService.sendRequestToNetwork;
     
     $scope.myDataSource=chart.getChart();

});

