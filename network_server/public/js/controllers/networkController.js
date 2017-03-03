angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,socket,networkInfoService,clientAPIService,parametersParsing,graphService) {
	
	 network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
	 $scope.subscriptions=[];
	 
	 
	 
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
    		for(var i=0;i<$scope.subscriptions.length;i++){
    			clientAPIService.sendRequestToNetwork('getParams',params,$scope.subscriptions[i].parametersSubscription.network.network_socket_id);
    		}
		}else if(msg.name=='params'){
			if(msg.data.params.paramsList){
				for(var i=0;i<$scope.subscriptions.length;i++){
					if($scope.subscriptions[i].parametersSubscription.layer==msg.data.params.layer){
						$scope.subscriptions[i].charts=[]
						chart=new graphService(msg.data.params.layer)
						chart.setData(msg.data.params.paramsList)
						$scope.subscriptions[i].charts.push(chart)
						$scope.subscriptions[i].kernelImages=parametersParsing.treatAsImages(msg.data.params.paramsList)

					}
				}
			}
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
    	 clientAPIService.sendRequestToNetwork('getParams','',network_socket_id);
     }
     
     $scope.editSubscription=function(parameters,layer){
    	 if(parameters){
        	 paramsFiltered=parametersParsing.filterParameters(parameters)
        	 if(paramsFiltered.length>0){
        		 params={'layer':layer,'params':paramsFiltered}
 				 for(var i=0;i<$scope.subscriptions.length;i++){
					 if($scope.subscriptions[i].parametersSubscription.layer==layer){
						 $scope.subscriptions[i].parametersSubscription.params=paramsFiltered
						 clientAPIService.sendRequestToNetwork('getParams',params,$scope.network.network_socket_id);
						 return
					 }
				 }
        		 subscription={}
        		 subscription.parametersSubscription={'layer':layer,'params':paramsFiltered}
        		 $scope.subscriptions.push(subscription)
        		 clientAPIService.sendRequestToNetwork('getParams',params,$scope.network.network_socket_id);
        	 }
    	 }
     };
     $scope.sendRequestToNetwork=clientAPIService.sendRequestToNetwork;

});

