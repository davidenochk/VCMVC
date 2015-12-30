"use strict";

(function ()
{
    angular.module('vc3app')
    .controller('HomeController', function ($scope, $q, $routeParams, $route, $location, HomeService, progress, data)
    {
        data.SetTitle('C3 Victory Secunderabad - Love • Grow • Build');
        $scope.bg = {};
        if ($routeParams.url)
        {
            $route.current.$$route.templateUrl = '/partials/' + $routeParams.url + '.html';
            //$route.path('/partials/' + $routeParams.url + '.html');
        }
        progress.inc();
        $q.all([HomeService.GetSlides()]).then(function (response)
        {
            $scope.bg = response[0].findAll('Name', 'home').findAll('isLive', true)[0];
            //$scope.StartSlideShow($scope.slides);
            progress.dec();
        }, function ()
        {
            progress.dec();
        });
        $scope.StartSlideShow = function StartSlideShow(slides)
        {
            for (var j = 0; j < slides.length; i++)
            {
                slides[j].showing = false;
            }
            var i = 0;
            if (slides.length)
            {
                slides[i].showing = true;
                setInterval(function ()
                {
                    slides[i].showing = false;
                    slides[i + 1].showing = true;
                    if (i + 1 === slides.length)
                        i = 1;
                }, 4000);
            }
        }
    })
})(angular)