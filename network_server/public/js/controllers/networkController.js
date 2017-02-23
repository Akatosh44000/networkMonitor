angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,socket,networkInfoService,clientAPIService) {
	
	 network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
	 
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
     socket.on('MESSAGE_FROM_NETWORK_TO_CLIENT', function (msg) {		if(msg.name=='newEpoch'){
			clientAPIService.sendRequestToNetwork($scope.network.network_socket_id,'getLoss');
		}else if(msg.name=='params'){
			console.log(msg.data);
		}
     });
	
     $scope.$on('$locationChangeStart', function(){
    	 clientAPIService.sendRequestToServer('unsubscribeFromNetwork',{'network_socket_id':$scope.network.network_socket_id});
	 });
     
     subscribe = function(network_socket_id){
    	 clientAPIService.sendRequestToServer('subscribeToNetwork',{'network_socket_id':network_socket_id});
     }
     
     $scope.sendRequestToNetwork1=function(name,params,network_socket_id){
    	 clientAPIService.sendRequestToNetwork(name,params,network_socket_id)
     }
});

