﻿"use strict";

(function () {
    angular.module('vc3app')
    .controller('SeriesController', function ($scope, SeriesService, $q, $location, config, $routeParams, progress, data) {
        $scope.serie = {};
        $scope.seriesID = parseInt($routeParams.id);
        progress.inc();
        $q.all([SeriesService.GetSeries($scope.seriesID)]).then(function (response)
        {
            $scope.serie = response[0].series;
            $scope.sermons = response[0].sermons;
            $scope.BindSeriesDetails();
            progress.dec();
        }, function () { progress.dec(); });
        $scope.BindSeriesDetails = function () {
            $scope.seriesDescription = ($scope.serie.About && $scope.serie.About.length) ? $scope.serie.About : config.default_series($scope.serie);
            data.SetTitle($scope.serie.Name + ' - Series');
        }
        $scope.GetSermonURL = function (id) {
            return config.sermonURL + id;
        }
    })
})(angular)