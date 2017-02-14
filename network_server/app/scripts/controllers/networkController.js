angular.module('networkServerApp').controller('networkController', 
		function($routeParams,$scope,$timeout,socket,networkInfoService,networkMessageService) {
	
	 var network_id=$routeParams.network_id;
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
     
     
     $scope.sendMessageToNetwork = function(network_socket_id){
    	 this.postMessage= function(network_socket_id){
	    	 networkMessageService.postNetworkMessage({'socket_id':network_socket_id,'message':'getInfo'})
		         .then(function(data) {
		        	 if(data.response=='None'){
		        		 console.log('ERROR WHILE POSTING MESSAGE TO NETWORK '+network_socket_id +
        				 ' THE NETWORK SEEMS DISCONNECTED FROM SOCKETIO')
		        	 }else{
		        		 console.log(data.response)
		        	 }
		         },
		         function(data) {
	        		 console.log('ERROR WHILE POSTING MESSAGE TO NETWORK '+network_socket_id)
		         });
     	};
     	this.postMessage(network_socket_id);
     };
});

