
var networkServerApp=angular.module('networkServerApp', ['ngRoute','ng-fusioncharts']);
networkServerApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/main.html"
    })
    .when("/network/:network_id", {

        templateUrl : "views/network.html"
    })
    .otherwise({
        redirectTo: "views/main.html"
    });

});
