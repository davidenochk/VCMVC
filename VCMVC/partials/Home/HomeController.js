"use strict";

(function () {
    angular.module('vc3app')
    .controller('HomeController', function ($scope, $q, $routeParams, $route, $location, HomeService, progress) {
        $scope.bg = {};
        if ($routeParams.url) {
            $route.current.$$route.templateUrl = '/partials/' + $routeParams.url + '.html';
            //$route.path('/partials/' + $routeParams.url + '.html');
        }
        $scope.bg.image = './Images/bgs/Web_1.jpg';
    })
})(angular)