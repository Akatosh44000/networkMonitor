angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,$timeout,socket,networkInfoService,networkMessageService) {
	
	 network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
	 
	 getNetwork = function(network_id) {
	 	 networkInfoService.getNetworkInfo(network_id)
         .then(function(data) {
        	var network=data.network;
 			if(network.network_status=='off'){
				network.network_color_status='red'
			}else{
				network.network_color_status='green'
			}
        	$scope.network=network;
        	subscribe(network.network_socket_id)
         },
         function(data) {
             console.log('ERROR WHILE RETRIEVING NETWORK '+network_id+' INFO')
         });
     };
     
     (function init() {
    	 getNetwork(network_id);
     })();
     
 	//RETRIEVAL BY SOCKETIO
     socket.on('PROBE_FROM_SERVER', function (data) {
    	 getNetwork(network_id);
     });
     socket.on('MESSAGE_FROM_SERVER', function (data) {
    	 console.log('SERVER SAYS : ' + data)
     });
     socket.on('MESSAGE_FROM_NETWORK', function (message) {
    	 console.log('NETWORK SAYS : ' + message)
    	 if(message=='newEpoch'){
    		 sendMessageToNetwork($scope.network.network_socket_id,'getLoss')
    	 }
     });
     socket.on('MESSAGE_FROM_NETWORK_TO_CLIENT', function (message) {
    	 console.log('NETWORK SAYS : ' + message)
    	
     });
     sendMessageToNetwork = function(network_socket_id,request){
    	 this.postMessage= function(network_socket_id){
    		 socket.emit('REQUEST_FROM_CLIENT_TO_NETWORK',{'request':{'name':request,'params':'coucou'},
    			 	'network_socket_id':network_socket_id})
     	};
     	this.postMessage(network_socket_id);
     };
     $scope.sendMessageToNetwork=function(network_socket_id,request){
    	 sendMessageToNetwork(network_socket_id,request);
     };
     $scope.$on('$locationChangeStart', function(){
		 console.log("byebye client :D",$scope.network.network_socket_id);
		 socket.emit('REQUEST_FROM_CLIENT_TO_SERVER',{'request':
			{'name':'unsubscribeFromNetwork','params':
			{'network_socket_id':$scope.network.network_socket_id}}});
	 });
     
     subscribe = function(network_socket_id){
    	 console.log("hello client :D",network_socket_id);
    	 socket.emit('REQUEST_FROM_CLIENT_TO_SERVER',{'request':
			{'name':'subscribeToNetwork','params':
			{'network_socket_id':network_socket_id}}});
     }
});

