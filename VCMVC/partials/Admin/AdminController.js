"use strict";
(function ()
{
    var app = angular.module('vc3app');
    app.directive('adminControl', function ($q, AdminService, progress, data)
    {
        return {
            restrict: 'EA',
            scope: {
                objectName: '@',
                defaultObject: '=',
                Obj: '=model'
            },
            controller: function ($scope)
            {
                $scope.new = false;
                $scope.edit = false;
                $scope.Delete = function Delete(id)
                {
                    data.remove($scope.objectName, id);
                }
                $scope.Save = function Save(id)
                {
                    progress.inc();
                    $q.all([data.Edit($scope.objectName, $scope.Obj.findAll('$id', id)[0])])
                    .then(function (response)
                    {
                        progress.dec();
                        $scope.edit = false;
                    })
                }
                $scope.Add = function Add()
                {
                    $scope.newObj = angular.copy($scope.defaultObject);
                    $scope.new = true;
                }
                $scope.Push = function Push()
                {
                    progress.inc();
                    $q.all([data.push($scope.objectName, $scope.newObj)])
                    .then(function (response)
                    {
                        console.log(response);
                        $scope.new = false;
                        progress.dec();
                    })
                }
                $scope.Cancel = function Cancel()
                {
                    $scope.new = false;
                    $scope.edit = false;
                }
                $scope.GetKeys = function GetKeys(obj)
                {
                    if (obj)
                    {
                        return Object.keys(obj);
                    }
                    else
                        return [];
                }
            },
            templateUrl: 'partials/Util/adminControl.html'
        }
    })
    app.controller('AdminController', function ($scope, $q, data, progress)
    {
        progress.inc();
        $q.all([data.GetSeries(), data.GetSermons(), data.GetSpeakers(), data.GetPages(), data.GetSlides()])
        .then(function (response)
        {
            $scope.Series = response[0];
            $scope.Sermons = response[1];
            $scope.Speakers = response[2];
            $scope.Pages = response[3];
            $scope.Slides = response[4];
            console.log($scope.Slides);
            progress.dec();
        })
    })
})(angular);