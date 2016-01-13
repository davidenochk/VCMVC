"use strict";
(function () {
    var app = angular.module('vc3app');
    app.controller('ArchiveController', ['$scope', '$q', 'ArchiveService', 'progress', 'config', function ($scope, $q, srv_archive, progress, config, $filter) {
        progress.inc();
        $q.all([srv_archive.GetArchive()]).then(function (response) {
            response = response[0];
            $scope.archive = response.archive;
            $scope.sermon = response.archive[0];
            progress.dec();
            $scope.series = response.series;
        })
        $scope.RedirectToSermon = function (sermonID) {
            config.RedirectToSermon(sermonID);
        }
        $scope.RedirectToSeries = function (seriesID) {
            config.RedirectToSeries(seriesID);
        }
        $scope.GetSermonURL = function (id) { return config.sermonURL + id };
        $scope.GetSeriesURL = function (id) { return config.seriesURL + id };
    }])
})(angular);