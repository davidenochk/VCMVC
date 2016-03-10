"use strict";

(function ()
{
    angular.module('vc3app')
    .controller('MapperController', function ($scope, $routeParams, data, config, $q, progress)
    {
        $scope.bgImage = '';
        $scope.page = {};
        $scope.GetPageDetails = function ()
        {
            progress.inc();
            $q.when(data.GetPages()).then(function (res)
            {
                $scope.pages = res;
                $scope.page = $scope.pages.findAll('Name', $routeParams.url)[0];
                console.log($scope.page);
                if ($scope.page && $scope.page.isLive)
                {
                    if ($scope.page.url)
                        $scope.page.url = '../partials/' + $scope.page.url;
                    else
                        $scope.page.url = '../partials/Common/defaultTemplate.html';
                    data.SetTitle($scope.page.Title);
                    console.log($scope.page.Title);
                }
                else
                    config.error('Page Not Found');
                progress.dec();
            });
        }
        $scope.GetPageDetails();
    })
})(angular)