angular.module("app",['ngRoute']);

// controller that passes the variable test to the template
angular.module('app')
.config([
	'$locationProvider',
	'$routeProvider',
	function($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');
	     // routes
	    $routeProvider
	        .when("/", {
	        	templateUrl: "./partials/partial1.html",
	          	controller: "MainController"
	        })
	        .otherwise({
	           redirectTo: '/'
	        });
	}
]);
 
//Load controller
angular.module('app')
.controller('MainController', [
	'$scope',
	function($scope) {
	   	$scope.test = "Testing...";
	}
]);
