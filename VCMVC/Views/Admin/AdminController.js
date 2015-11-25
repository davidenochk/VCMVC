'use strict';
(function () {
    angular.module('vc3app')
    .controller('AdminController', function ($scope, $q, AdminService, data) {
        $scope.sermons = {};
        $scope.series = {};
        $scope.speakers = {};
        data.GetSermons().then(function (sermons) {
            $scope.sermons = sermons;
        })
        data.GetSeries().then(function (series) {
            $scope.series = series;
        })
        data.GetSpeakers().then(function (speakers) {
            $scope.speakers = speakers;
        })
        $scope.AddSermon = function () {
            //take the sermon in scope and push to the AdminService
            AdminService.AddSermon($scope.sermon).then(function (ref) {
                console.log('Sermon Added Successfully', ref);
            })
        }
        //$scope.AddSermon();
        $scope.EditSermon = function () {
            //take the sermon in scope and push to the AdminService
            AdminService.EditSermon($scope.sermon, 0).then(function (ref) {
                console.log('Sermon Edited Successfully', ref);
            })
        }
        $scope.GetHeads = function (obj, name) {
            var keys = [];
            if (!name)
                name = '';
            if (obj.length) {
                if (name.toUpperCase() == 'SERMONS') {
                    keys = ['ID', 'Name', 'About', 'Date', 'By', 'Place', 'SeriesID', 'Audio', 'Video', 'Art', 'SmallArt', 'Status'];
                    return keys;
                }
                else if (name.toUpperCase() == 'SERIES') {
                    keys = ['ID', 'Name', 'About', 'By', 'Art', 'SmallArt', 'Status'];
                    return keys;
                }
                else if (name.toUpperCase() == 'SPEAKERS') {
                    keys = ['ID', 'Name'];
                    return keys;
                }
                else {
                    return Object.keys(obj[0]);
                }
            }
        }
        $scope.Edit = function (type, obj) {
            if (type.toUpperCase() == 'SERMONS') {
                console.log(obj.SERMONID);
            }
            else if (type.toUpperCase() == 'SERIES') {
                console.log(obj.SERIESID);
            }
            else if (type.toUpperCase() == 'SPEAKERS') {
                console.log(obj.SPEAKERID);
            }
        }
    })
})(angular);