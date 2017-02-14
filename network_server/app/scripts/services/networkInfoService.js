angular.module('networkServerApp').service('networkInfoService',function($http,$q) {
	
    	var service = {
            network: [],
            getNetworkInfo: getNetworkInfo
        };
    	
    	return service;
        // implementation
        function getNetworkInfo(network_id) {
            var def = $q.defer();
            $http.get('/getNetwork/'+network_id)
                .success(function(data) {
                    def.resolve(data);
                })
                .error(function() {
                    def.reject('ERROR:: $http:getNetworkInfo with param '+network_id);
                });
            return def.promise;
        }
});