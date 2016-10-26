

var app = angular.module('LoginApp', []);
app.controller('Logctlr', function ($scope , $http) {
  
   
    
    $scope.saveIt = function (SignUpData) {
        alert("saved");
        $http ({
            type: "POST",
            url: "Log.asmx/SaveSignUpData",
            data:   $scope.SignUpData
           

        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


        
        



    }
    });