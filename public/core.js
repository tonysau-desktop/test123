// public/core.js
var messages = angular.module('messages', []);
function mainController($scope, $http) {
    $scope.formData = {};

    var rafraichir = function() {
    $http.get('/api/etudiants')
        .success(function(data) {
            
            angular.forEach(data, function(etudiant){
              if (etudiant.hyperlien.length != 0){
                etudiant.messageApi = etudiant.hyperlien;
              }
            });

            $scope.etudiants = data;
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