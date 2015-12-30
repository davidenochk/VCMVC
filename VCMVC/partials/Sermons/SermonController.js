"use strict";

(function () {
    angular.module('vc3app')
    .controller('SermonController', function ($scope, SermonService, $q, $location, $routeParams, progress, data) {
        $scope.sermon = {};
        $scope.sermonID = parseInt($routeParams.id);
        progress.inc();
        $q.all([SermonService.GetSermon($scope.sermonID), data.GetSeries(), data.GetSpeakers()]).then(function (response)
        {
            console.log(response);
            $scope.sermon = response[0];
            $scope.series = response[1];
            $scope.speakers = response[2];
            $scope.BindSermonDetails();
            progress.dec();
        });
        $scope.BindSermonDetails = function () {
            $scope.sermonDescription = $scope.sermon.About;
            console.log($scope.series.find('ID', $scope.sermon.SeriesID).Name + ' - ' + $scope.sermon.Name);
            data.SetTitle($scope.sermon.SeriesID === 0 ? $scope.sermon.Name + ' - Sermon' : $scope.series.find('ID', $scope.sermon.SeriesID).Name + ' - ' + $scope.sermon.Name);
        }
        $scope.DownloadSermon = function () {
            var el = document.getElementById('download-link');
            el.click();
        }
        $scope.GetArt = function ()
        {
            var sermon = $scope.sermon;
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