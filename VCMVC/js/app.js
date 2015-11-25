"use strict";
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
            templateUrl: "AJSViews/Home/home.html",
            controller: "HomeController"
        })
        .when("/sermon/:id", {
            templateUrl: "AJSViews/Sermons/sermon.html",
            controller: "SermonController"
        })
        .when('/home', {
            templateUrl: 'AJSViews/Home/home.html',
            controller: 'HomeController'
        })
        .when("/series/:id", {
            templateUrl: "AJSViews/Sermons/series.html",
            controller: "SeriesController"
        })
        .when('/archive', {
            templateUrl: 'AJSViews/Archive/Archive.html',
            controller: "ArchiveController"
        })
        .when('/about', {
            templateUrl: 'AJSViews/About/About.html',
            controller: "AboutController"
        })
        .when('/ministry', {
            templateUrl: 'AJSViews/About/Ministry.html',
            controller: "MinistryController"
        })
        .when('/contact', {
            templateUrl: 'AJSViews/Contact/Contact.html',
            controller: "ContactController"
        })
        .when('/contact/accepting-jesus', {
            templateUrl:'AJSViews/Contact/AcceptingJesus.html',
            controller: 'ContactController'
        })
        .otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);
    })
    .controller('MainCtrl', function ($scope, progress, config) {
        $scope.progress = progress.GetCount();
        $scope.mail_info = config.mail_info;
    })
.controller('AppCtrl', function ($scope, $http, $filter) {
    //$http.post('../vc3siteservice.asmx/GetSpeakers', {}).success(function (data) {
    //    $scope.speakers = JSON.parse(data.d);
    //})
    //$http.post('../vc3siteservice.asmx/GetSeries', {}).success(function (data) {
    //    $scope.series = JSON.parse(data.d);
    //})
    //$scope.srm = {}
    //$scope.srm.place = '';
    //$scope.srm.series = 0;
    //$scope.srm.image = '';
    //$scope.srm.video = '';
    //$scope.AddSermon = function () {
    //    var data = {
    //        title: $scope.srm.name,
    //        descr: $scope.srm.desc,
    //        by: $scope.srm.by,
    //        seriesID: $scope.srm.series,
    //        sermonPlace: $scope.srm.place,
    //        sermonDate: $filter('date')($scope.srm.date, 'longDate'),
    //        audioLink: $scope.srm.audio,
    //        imageLink: $scope.srm.image,
    //        videoLink: $scope.srm.video,
    //        artLink: $scope.srm.art,
    //        artSmallLink: $scope.srm.art_sml
    //    }
    //    $http.post('../vc3siteservice.asmx/AddSermon', data).success(function (data) {
    //        console.log(data);
    //    });
    //}
});
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
    this.sermonURL = '/Sermon/';
    this.seriesURL = '/Series/';
    this.fire_SermonsURL = "https://" + fire_app_name + ".firebaseio.com/sermons";
    this.fire_SeriesURL = "https://" + fire_app_name + ".firebaseio.com/series";
    this.fire_SpeakersURL = "https://" + fire_app_name + ".firebaseio.com/speakers";
    this.fire_ImagesURL = "https://" + fire_app_name + ".firebaseio.com/images";
    this.fire_SlidesURL = "https://" + fire_app_name + ".firebaseio.com/slides";
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
})