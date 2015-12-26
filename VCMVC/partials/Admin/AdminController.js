"use strict";
(function () {
    var app = angular.module('vc3app');
    app.directive('adminControl', function ($q, AdminService, progress) {
        return {
            restrict: 'EA',
            scope: {
                objectName: '@',
                defaultObject: '='
            },
            controller: function ($scope) {
                $scope.GetData = function GetData() {
                    progress.inc();
                    $q.all([AdminService.GetAllData()]).then(function (response) {
                        console.log(response[0]);
                        $scope.Series = response[0];
                        $scope.sermons = response[1];
                        $scope.speakers = response[2];
                        $scope.images = response [3];
                        progress.dec();
                    },
                    function (error) {
                        progress.dec();
                    });
                }
                $scope.GetData();
                
            },
            templateUrl:'partials/Util/adminControl.html'
        }
    })
    app.controller('AdminController', function ($scope, $q) {
        //progress.inc();
        
    })
})(angular);