"use strict";

(function () {
    angular.module('vc3app')
    .controller('SermonController', function ($scope, SermonService, $q, $location, $routeParams, progress, data) {
        $scope.sermon = {};
        $scope.sermonID = parseInt($routeParams.id);
        progress.inc();
        $q.all([SermonService.GetSermon($scope.sermonID), data.GetSeries(), data.GetSpeakers()]).then(function (response) {
            $scope.sermon = response[0];
            $scope.series = response[1];
            $scope.speakers = response[2];
            $scope.BindSermonDetails();
            progress.dec();
        });
        $scope.BindSermonDetails = function () {
            $scope.sermonDescription = $scope.sermon.About;
        }
        $scope.DownloadSermon = function () {
            var el = document.getElementById('download-link');
            console.log(el);
            el.click();
        }
        $scope.GetArt = function (sermon) {
            if (sermon && $scope.series)
                return sermon.Art ? sermon.Art : $scope.series.find('ID', sermon.SeriesID).Art;
        }
        $scope.PlayAudio = function () {
            var el = document.getElementById('divListen');
            el.innerHTML = '<div flex><audio controls><source src=' + $scope.sermon.Audio + ' /></audio></div>';
            $('#divListen').css('display', 'block');
        }
        $scope.GetSpeakerName = function (id) {
            if ($scope.speakers)
                return $scope.speakers.find('ID', id).Name;
        }
    })
})(angular)