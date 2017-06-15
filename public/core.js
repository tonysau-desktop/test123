// public/core.js
var messages = angular.module('messages', []);
function mainController($scope, $http) {
    $scope.formData = {};

    var rafraichir = function() {
    $http.get('/api/message')
        .success(function(data) {
			
            $scope.message = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  };
  var timer = setInterval(function() {
    $scope.$apply(rafraichir);
  }, 5000000);
  rafraichir();
}