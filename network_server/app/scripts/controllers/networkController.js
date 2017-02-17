angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,$timeout,socket,networkInfoService,networkMessageService) {
	
	 var network_id=$routeParams.network_id;
	 $scope.network_id=network_id;
	
	 getNetwork = function(network_id) {
		 networkInfoService.getNetworkInfo(network_id)
             .then(function(data) {
            	var network=data.network;
            	console.log(network)
     			if(network.network_status=='off'){
    				network.network_color_status='red'
    			}else{
    				network.network_color_status='green'
    			}
            	 $scope.network=network;
             },
             function(data) {
                 console.log('ERROR WHILE RETRIEVING NETWORK '+network_id+' INFO')
             });
     };
     getNetwork(network_id);
     
     
 	//RETRIEVAL BY SOCKETIO
     socket.on('PROBE_FROM_SERVER', function (data) {
    	 getNetwork(network_id);
     });
     socket.on('MESSAGE_FROM_SERVER', function (data) {
    	 console.log('SERVER SAYS : ' + data)
     });
     
     
     $scope.sendMessageToNetwork = function(network_socket_id,request){
    	 this.postMessage= function(network_socket_id){
    		 socket.emit('REQUEST_FROM_CLIENT_TO_NETWORK',{'request':{'name':request,'params':'coucou'},
    			 	'network_socket_id':network_socket_id})
     	};
     	this.postMessage(network_socket_id);
     };
});

