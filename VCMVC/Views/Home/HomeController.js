"use strict";

(function () {
    angular.module('vc3app')
    .controller('HomeController', function ($scope, $q, HomeService, progress) {
        $scope.bg = {};
        //progress.inc();
        //$q.all([HomeService.GetSlides()]).then(function (response) {
        //    //$scope.bg = response[0];
        //    progress.dec();
        //})
        $scope.bg.image = 'Images/bgs/Web_1.jpg';
    })
})(angular)