angular.module('networkServerApp').service('networkInfoService',function() {
	
	this.parseNetworksData=function(networks){
		for (var i = 0; i < networks.length; i++) {
			networks[i]=this.parseNetworkData(networks[i])
		}
		return networks;
	};
	this.parseNetworkData=function(network){
		if(network.network_status=='off'){
			network.network_color_status='red'
		}else{
			network.network_color_status='green'
		}
		return network;
	};

});