angular.module('networkServerApp').service('clientAPIService',function(socket) {
	
	this.sendRequestToServer=function(name,params){
		socket.emit('REQUEST_FROM_CLIENT_TO_SERVER',{'name':name,'params':params});
	};
	
	this.sendRequestToNetwork = function(name,params,network_socket_id){
		 socket.emit('REQUEST_FROM_CLIENT_TO_NETWORK',
				 {'network_socket_id':network_socket_id,'name':name,'data':params});
	};

	
});