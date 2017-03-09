angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,socket,networkInfoService,clientAPIService,parametersParsing,graphService) {
	
	 network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
	 $scope.subscriptions=[];
	 
	 
	 
     (function init() {
    	 clientAPIService.sendRequestToServer('getNetworkInfoWithId',{'network_id':network_id});
    	 $scope.view_tab='home'
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
    			if($scope.subscriptions[i].params){
        			clientAPIService.sendRequestToNetwork('getParams',$scope.subscriptions[i].params,$scope.network.network_socket_id);
    			}
    			if($scope.subscriptions[i].pipelineParams){
    				clientAPIService.sendRequestToNetwork('getPipeline',$scope.subscriptions[i].pipelineParams,$scope.network.network_socket_id);
    			}
    		}
		}else if(msg.name=='params'){
			if(msg.data.params.paramsList){
				chart=new graphService(msg.data.params.layer)
				chart.setData(msg.data.params.paramsList)
				$scope.subscriptions[msg.data.params.layer].charts=[]
				$scope.subscriptions[msg.data.params.layer].charts.push(chart)
				$scope.subscriptions[msg.data.params.layer].kernelImages=parametersParsing.treatAsImages(msg.data.params.paramsList)
			}
		}else if(msg.name=='architecture'){
			layers=parametersParsing.filterArchitecture(msg.data.architecture);
			for(var i=0;i<layers.length;i++){
				layer={}
				layer.architecture=layers[i]
				$scope.subscriptions.push(layer);
			}
		}else if(msg.name=='testError'){
			console.log('TEST ERROR : '+msg.data.testError)
		}else if(msg.name=='pipeline'){
			img=parametersParsing.treatAsImages(msg.data.pipeline.images)
			$scope.subscriptions[msg.data.pipeline.layer].pipeline=img;
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
     $scope.editParameterSubscription=function(parameters,layer){
    	 if(parameters){
        	 paramsFiltered=parametersParsing.filterParameters(parameters)
        	 if(paramsFiltered.length>0){
        		 params={'layer':layer,'params':paramsFiltered}
        		 $scope.subscriptions[layer].params=params
        		 clientAPIService.sendRequestToNetwork('getParams',params,$scope.network.network_socket_id);
        	 }else{
        		 params={'layer':layer,'params':paramsFiltered}
        		 if($scope.subscriptions[layer].params){
        			 delete $scope.subscriptions[layer].params
        		 }
        	 }
    	 }
     };
     $scope.sendRequestToNetwork=clientAPIService.sendRequestToNetwork;
     
     $scope.changeTab = function(tab) {
    	 $scope.view_tab = tab;
	 }
     $scope.editPipelineSubscription=function(parameters){	 
    	 if(parameters){
    		 paramsFiltered=parametersParsing.filterPipeline(parameters)
        	 for(var layer=0;layer<$scope.subscriptions.length;layer+=1){
            	 if(paramsFiltered.length>0){
            		 params={'layer':layer,'input':paramsFiltered}
            		 $scope.subscriptions[layer].pipelineParams=params
            		 clientAPIService.sendRequestToNetwork('getPipeline',params,$scope.network.network_socket_id);
            	 }else{
            		 if($scope.subscriptions[layer].pipelineParams){
            			 delete $scope.subscriptions[layer].pipelineParams
            		 }
            	 }
        	 }
        }
     }
});

