angular.module('networkServerApp').service('networkMessageService',function($http,$q) {
	var response = {
		postNetworkMessage: postNetworkMessage
    };
	return response;
    // implementation
    function postNetworkMessage(message) {
        var def = $q.defer();
        $http.post('/postNetworkMessage',message)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject('ERROR:: $http:postNetworkMessage with param '+message);
            });
        return def.promise;
    }
});