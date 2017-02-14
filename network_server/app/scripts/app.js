
var networkServerApp=angular.module('networkServerApp', ["ngRoute"]);
networkServerApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/main.html"
    })
    .when("/network/:network_id", {

        templateUrl : "templates/network.html"
    })
    .otherwise({
        redirectTo: "templates/main.html"
    });

});

