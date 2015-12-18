"use strict";
(function () {
    var app = angular.module('vc3app', ['ngMaterial', 'ngSanitize', 'ngRoute', 'firebase', 'Util'])
        .filter('dateCustom', function ($filter) {
            return function (val) {
                return $filter('date')(new Date(val), 'dd MMM, yyyy');
            }
        })
        .config(function ($mdIconProvider) {
            $mdIconProvider
            .defaultIconSet('../../icons/icon.svg')
            .iconSet('social', '../../icons/social.svg')
            .iconSet('hardware', '../../icons/hardware.svg')
            .iconSet('comm', '../../icons/communication.svg')
            .iconSet('action', '../../icons/action.svg')
            .iconSet('navigation', '../../icons/navigation.svg', 24)
        })
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider.when("/", {
                templateUrl: "partials/Home/home.html",
                controller: "HomeController"
            })
            .when("/sermon/:id", {
                templateUrl: "partials/Sermons/sermon.html",
                controller: "SermonController"
            })
            .when('/home', {
                templateUrl: 'partials/Home/home.html',
                controller: 'HomeController'
            })
            .when("/series/:id", {
                templateUrl: "partials/Sermons/series.html",
                controller: "SeriesController"
            })
            .when('/archive', {
                templateUrl: 'partials/Archive/Archive.html',
                controller: "ArchiveController"
            })
            .when('/about', {
                templateUrl: 'partials/About/About.html',
                controller: "AboutController"
            })
            .when('/ministry', {
                templateUrl: 'partials/About/Ministry.html',
                controller: "MinistryController"
            })
            .when('/contact', {
                templateUrl: 'partials/Contact/Contact.html',
                controller: "ContactController"
            })
            .when('/contact/accepting-jesus', {
                templateUrl: 'partials/Contact/AcceptingJesus.html',
                controller: 'ContactController'
            })
            .when('/error/:msg', {
                templateUrl: 'partials/Common/error.html',
                controller: function ($scope, $routeParams) {
                    $scope.msg = $routeParams.msg;
                }
            })
            .when('/:url', {
                templateUrl: 'partials/Common/mappedTemplate.html',
                controller: 'MapperController'
            })
            .otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        })
        .directive('contentPageTemplate', function () {
            return {
                restrict: 'E',
                templateUrl: 'partials/Common/contentPageDirTemplate.html',
                controller: function ($scope, data) {
                    var pages = data.pages;
                    $scope.page = pages[$scope.pagename];
                },
                scope: {
                    pagename: '@'
                }
            }
        })
        .directive('socialLinks', function () {
            return {
                restrict: 'E',
                template: '<div class="social" data-layout="row" data-layout-align="space-around center"><a target="_blank" ng-href="{{social.facebook}}"><img src="Images/facebook.png" /></a><a target="_blank" ng-href="{{social.twitter}}"><img src="Images/twitter.png" /></a><a target="_blank" ng-href="{{social.instagram}}"><img src="Images/instagram.png" /></a></div>',
                controller: function ($scope, data) {
                    $scope.social = data.social();
                }
            }
        })
        .controller('MainCtrl', function ($scope, progress, config) {
            $scope.progress = progress.GetCount();
            $scope.mail_info = config.mail_info;
        })
    app.controller('SermonController', function ($scope, data, $sce, $window, config) {
        $scope.series = data.series;
        $scope.sermons = data.sermons;
        $scope.serie = {};
        $scope.sermon = {};
        $scope.GetSermonURL = function (id) {
            return config.sermonURL + id;
        }
        $scope.SetCurrentSeries = function () {
            //Get the seriesid from query strings
            //Match the seriesid in the seriescollection
            //Set the series details to the $scope.serie variable
            var seriesID = 2;
            for (var i = 0; i < $scope.series.length; i++) {
                if ($scope.series[i].SERIESID === seriesID) {
                    $scope.serie = $scope.series[i];
                    $scope.seriesDescription = $sce.trustAsHtml($scope.serie.SERIESDESCRIPTION);
                    return;
                }
            }
        }
        $scope.SetCurrentSermon = function () {
            //Get the sermonid from query strings
            //Match the sermonid in the sermonsCollection
            //Set the sermon details to the $scope.sermon variable
            var sermonID = $scope.sermons.sort(comp)[0].SERMONID;
            for (var i = 0; i < $scope.sermons.length; i++) {
                if ($scope.sermons[i].SERMONID === sermonID) {
                    $scope.sermon = $scope.sermons[i];
                    $scope.sermonDescription = $sce.trustAsHtml($scope.sermon.SERMONDESCRIPTION);
                    return;
                }
            }
        }
        $scope.series.$loaded(function () {
            $scope.SetCurrentSeries();
        })
        $scope.sermons.$loaded(function () {
            $scope.SetCurrentSermon();
        })
    })
    app.service('data', function ($firebaseArray, $firebaseObject, $q, config) {
        let thiss = this;
        this.series = {};
        this.GetSeries = function () {
            var q = $q.defer();
            if (!thiss.series.length) {
                var srsObj = new Firebase(config.fire_SeriesURL);
                var series = $firebaseArray(srsObj);
                series.$loaded(function (res) { thiss.series = res; q.resolve(thiss.series); });
                console.log('Series Refreshed');
            } else {
                console.log('Series From Cache');
                q.resolve(thiss.series);
            }
            return q.promise;
        }
        this.sermons = {};
        this.GetSermons = function () {
            var q = $q.defer();
            if (!thiss.series.length) {
                var srsObj = new Firebase(config.fire_SermonsURL);
                var sermons = $firebaseArray(srsObj);
                sermons.$loaded(function (res) { thiss.sermons = res; q.resolve(thiss.sermons); })
                console.log('Sermons Refreshed');
            } else {
                console.log('Sermons from cache');
                q.resolve(thiss.sermons);
            }
            return q.promise;
        }
        this.speakers = {};
        this.GetSpeakers = function () {
            var q = $q.defer();
            if (!thiss.speakers.length) {
                var srsObj = new Firebase(config.fire_SpeakersURL);
                var speakers = $firebaseArray(srsObj);
                speakers.$loaded(function (res) { thiss.speakers = res; q.resolve(thiss.speakers); })
            } else {
                q.resolve(thiss.speakers);
            }
            return q.promise;
        }
        this.images = {};
        this.GetImages = function () {
            var q = $q.defer();
            if (!thiss.images.length) {
                var imgObj = new Firebase(config.fire_ImagesURL);
                var images = $firebaseArray(imgObj);
                images.$loaded(function (res) { thiss.images = res; q.resolve(FormArray(thiss.images)); })
            }
            else {
                q.resolve(thiss.images);
            }
            return q.promise;
        }
        this.slides = {};
        this.GetSlides = function () {
            var q = $q.defer();
            if (!thiss.slides.length) {
                var slideObj = new Firebase(config.fire_SlidesURL);
                var slides = $firebaseArray(slideObj);
                slides.$loaded(function (res) { thiss.slides = res; q.resolve(FormArray(thiss.slides)); })
            }
            else {
                q.resolve(thiss.slides);
            }
            return q.promise;
        }
        this.Add = function (name, sermon) {
            var deferred = $q.defer();
            var srsObj = new Firebase(config.fire_SermonsURL);
            var sermons = $firebaseArray(srsObj);
            console.log('trig');
            sermons.$add(sermon).then(function (ref) {
                var id = ref.key();
                deferred.resolve(id);
            })
            return deferred.promise;
        }
        this.Edit = function (name, newsermon, id) {
            var deferred = $q.defer();
            var srs = new Firebase(config.fire_SermonsURL + "/" + id);
            var sermon = $firebaseObject(srs);
            sermon = CopyObject(newsermon, sermon);
            sermon.$save().then(function (res) {
                deferred.resolve(res);
            })
            return deferred.promise;
        }
        this.pages = {
            'learn-more': {
                isLive: true,
                bgImage: 'Images/bgs/Web_1.jpg',
                title: 'Learn More',
                url: 'Common'
            }
        };
        this.GetPageDetails = function (name) {
            var pages = thiss.pages;
            var page = pages[name.toLowerCase()];
            return page ? page : { isLive: false, };
        }
        this.social = function () {
            return {
                facebook: 'https://www.facebook.com/C3Victory/',
                twitter: 'https://twitter.com/c3victorysecbad',
                instagram: 'https://www.instagram.com/c3victorysecbad/'
            }
        }
        var CopyObject = function (oldObj, newObj) {
            var keys = Object.keys(oldObj);
            for (var i = 0 ; i < keys.length; i++) {
                var key = keys[i];
                newObj[key] = oldObj[key];
            }
            return newObj;
        }
        var FormArray = function (inObj) {
            var outObj = {};
            for (var i = 0; i < inObj.length; i++) {
                var str = inObj[i].$id;
                if (inObj[i].$value)
                    outObj[str] = inObj[i].$value;
                else {
                    var keys = Object.keys(inObj[i]);
                    for (var j = 0; j < keys.length; j++) {
                        if (keys[j].indexOf('$') < 0)
                            outObj[keys[j]] = inObj[i][keys[j]];
                    }
                }
            }
            return outObj;
        }
    });
    app.service('config', function ($window) {
        let _this = this;
        var fire_app_name = "demovc3";
        //this.sermonURL = 'http://' + $window.location.host + '/Presentation/Sermons/sermon.aspx?id=';
        //this.seriesURL = 'http://' + $window.location.host + '/Presentation/Series/series.aspx?id=';
        this.sermonURL = '/sermon/';
        this.seriesURL = '/series/';
        this.fire_SermonsURL = "https://" + fire_app_name + ".firebaseio.com/sermons";
        this.fire_SeriesURL = "https://" + fire_app_name + ".firebaseio.com/series";
        this.fire_SpeakersURL = "https://" + fire_app_name + ".firebaseio.com/speakers";
        this.fire_ImagesURL = "https://" + fire_app_name + ".firebaseio.com/images";
        this.fire_SlidesURL = "https://" + fire_app_name + ".firebaseio.com/slides";
        this.fire_PagesURL = "https://" + fire_app_name + ".firebaseio.com/pages";
        this.RedirectToSermon = function (id) {
            $window.location.href = _this.sermonURL + id;
        }
        this.RedirectToSeries = function (id) {
            $window.location.href = _this.seriesURL + id;
        }
        this.default_series = function (serie) {
            return 'This sermon series was recorded on one of the Sunday services.';
        }
        this.mail_info = "info@c3victory.in";
        this.error = function (msg) {
            $window.location.href = '/error/' + msg;
        }
    })
})(angular)