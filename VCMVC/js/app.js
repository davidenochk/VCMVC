"use strict";
var version = 1;
(function ()
{
    var app = angular.module('vc3app', ['ngMaterial', 'ngSanitize', 'ngRoute', 'firebase', 'Util'])
        .filter('dateCustom', function ($filter)
        {
            return function (val)
            {
                if (val)
                    return $filter('date')(new Date(val), 'dd MMM, yyyy');
                else
                    return '';
            }
        })
        .config(function ($mdIconProvider)
        {
            $mdIconProvider
            .defaultIconSet('../../icons/icon.svg')
            .iconSet('social', '../../icons/social.svg')
            .iconSet('hardware', '../../icons/hardware.svg')
            .iconSet('comm', '../../icons/communication.svg')
            .iconSet('action', '../../icons/action.svg')
            .iconSet('navigation', '../../icons/navigation.svg', 24)
        })
        .config(function ($routeProvider, $locationProvider)
        {
            var version = '1';
            $routeProvider.when("/", {
                templateUrl: 'partials/Home/home.html?v=' + version,
                controller: "HomeController"
            })
            .when("/sermon/:id", {
                templateUrl: 'partials/Sermons/sermon.html?v=' + version,
                controller: "SermonController"
            })
            .when('/home', {
                templateUrl: 'partials/Home/home.html?v=' + version,
                controller: 'HomeController'
            })
            .when("/series/:id", {
                templateUrl: 'partials/Sermons/series.html?v=' + version,
                controller: "SeriesController"
            })
            .when('/archive', {
                templateUrl: 'partials/Archive/Archive.html?v=' + version,
                controller: "ArchiveController"
            })
            .when('/admin', {
                templateUrl: 'partials/Admin/Admin.html?v=' + version,
                controller: "AdminController"
            })
            .when('/ministry', {
                templateUrl: 'partials/About/Ministry.html?v=' + version,
                controller: "MinistryController"
            })
            //.when('/contact', {
            //    templateUrl: 'partials/Contact/Contact.html?v=' + version,
            //    controller: "ContactController"
            //})
            .when('/contact/accepting-jesus', {
                templateUrl: 'partials/Contact/AcceptingJesus.html?v=' + version,
                controller: 'ContactController'
            })
            .when('/error/:msg', {
                templateUrl: 'partials/Common/error.html?v=' + version,
                controller: function ($scope, $routeParams)
                {
                    $scope.msg = $routeParams.msg;
                }
            })
            .when('/:url', {
                templateUrl: 'partials/Common/mappedTemplate.html?v=' + version,
                controller: 'MapperController'
            })
            .otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        })
        .directive('contentPageTemplate', function ()
        {
            return {
                restrict: 'E',
                templateUrl: 'partials/Common/contentPageDirTemplate.html?v=' + version,
                controller: function ($scope, data)
                {
                    var pages = data.pages;
                    console.log($scope.pagename);
                    $scope.page = pages.findAll('Name', $scope.pagename)[0];
                    console.log($scope.page);
                },
                scope: {
                    pagename: '@'
                }
            }
        })
        .directive('secondLinks', function ()
        {
            return {
                restrict: 'E',
                scope:{
                    name:'@'
                },
                templateUrl: 'partials/Common/secondLinks.html?v=' + version,
                controller: function ($scope, data, $q, progress)
                {
                    progress.inc();
                    $q.all([data.GetPages()]).then(function (response)
                    {
                        console.log(response[0], $scope.name);
                        $scope.links = response[0].findAll('parent', $scope.name).findAll('isLive', true);
                        console.log($scope.links);
                        progress.dec();
                    }, function ()
                    {
                        progress.dec();
                    })
                }
            }
        })
        .service('popups', function PopupService($mdDialog)
        {
            this.ShowDialog = function ()
            {
                $mdDialog.show();
            }
        })
        .directive('socialLinks', function ()
        {
            return {
                restrict: 'E',
                template: '<div class="social" data-layout="row" data-layout-align="space-around center"><a target="_blank" ng-href="{{social.facebook}}"><img src="Images/facebook.png" /></a><a target="_blank" ng-href="{{social.twitter}}"><img src="Images/twitter.png" /></a><a target="_blank" ng-href="{{social.instagram}}"><img src="Images/instagram.png" /></a></div>',
                controller: function ($scope, data)
                {
                    $scope.social = data.social();
                }
            }
        })
        .controller('MainCtrl', function ($scope, progress, config, data)
        {
            $scope.progress = progress.GetCount();
            $scope.mail_info = config.mail_info;
            $scope.title = data.GetTitle();
            console.log($scope.title);
            $scope.content = 'C3 CHURCH SECUNDERABAD IS ONE OF THE CONTEMPORARY CHURCHES IN HYDERABAD AND SECUNDERABAD WITH BURDEN FOR URBAN YOUTH, PASSIONATE TO PRAISE, WORSHIP AND GLORIFY GOD AND EMPOWER THE WEAK WITH THE WORD OF GOD.';
        })
    app.controller('SermonController', function ($scope, data, $sce, $window, config)
    {
        $scope.series = data.series;
        $scope.sermons = data.sermons;
        $scope.serie = {};
        $scope.sermon = {};
        $scope.GetSermonURL = function (id)
        {
            return config.sermonURL + id;
        }
        $scope.SetCurrentSeries = function ()
        {
            //Get the seriesid from query strings
            //Match the seriesid in the seriescollection
            //Set the series details to the $scope.serie variable
            var seriesID = 2;
            for (var i = 0; i < $scope.series.length; i++)
            {
                if ($scope.series[i].SERIESID === seriesID)
                {
                    $scope.serie = $scope.series[i];
                    $scope.seriesDescription = $sce.trustAsHtml($scope.serie.SERIESDESCRIPTION);
                    return;
                }
            }
        }
        $scope.SetCurrentSermon = function ()
        {
            //Get the sermonid from query strings
            //Match the sermonid in the sermonsCollection
            //Set the sermon details to the $scope.sermon variable
            var sermonID = $scope.sermons.sort(comp)[0].SERMONID;
            for (var i = 0; i < $scope.sermons.length; i++)
            {
                if ($scope.sermons[i].SERMONID === sermonID)
                {
                    $scope.sermon = $scope.sermons[i];
                    $scope.sermonDescription = $sce.trustAsHtml($scope.sermon.SERMONDESCRIPTION);
                    return;
                }
            }
        }
        $scope.series.$loaded(function ()
        {
            $scope.SetCurrentSeries();
        })
        $scope.sermons.$loaded(function ()
        {
            $scope.SetCurrentSermon();
        })
    })
    app.service('data', function ($firebaseArray, $firebaseObject, $q, config)
    {
        var thiss = this;
        this.Title = { title: 'C3 Victory Secunderabad - Love • Grow • Build' };
        this.SetTitle = function SetTitle(title)
        {
            if (title.length)
                thiss.Title.title = title + ' - C3 Victory Secunderabad';
            else
                thiss.Title.title = 'C3 Victory Secunderabad - Love • Grow • Build';
            console.log(thiss.Title);
        }
        this.GetTitle = function GetTitle()
        {
            return thiss.Title;
        }
        this.series = {};
        this.GetSeries = function ()
        {
            var q = $q.defer();
            if (!thiss.series.length)
            {
                var srsObj = new Firebase(config.fire_SeriesURL);
                var series = $firebaseArray(srsObj);
                series.$loaded(function (res) { thiss.series = res; q.resolve(thiss.series); });
                console.log('Series Refreshed');
            } else
            {
                console.log('Series From Cache');
                q.resolve(thiss.series);
            }
            return q.promise;
        }
        this.sermons = {};
        this.GetSermons = function ()
        {
            var q = $q.defer();
            if (!thiss.series.length)
            {
                var srsObj = new Firebase(config.fire_SermonsURL);
                var sermons = $firebaseArray(srsObj);
                sermons.$loaded(function (res) { thiss.sermons = res; q.resolve(thiss.sermons); })
                console.log('Sermons Refreshed');
            } else
            {
                console.log('Sermons from cache');
                q.resolve(thiss.sermons);
            }
            return q.promise;
        }
        this.speakers = {};
        this.GetSpeakers = function ()
        {
            var q = $q.defer();
            if (!thiss.speakers.length)
            {
                var srsObj = new Firebase(config.fire_SpeakersURL);
                var speakers = $firebaseArray(srsObj);
                speakers.$loaded(function (res) { thiss.speakers = res; q.resolve(thiss.speakers); })
            } else
            {
                q.resolve(thiss.speakers);
            }
            return q.promise;
        }
        this.images = {};
        this.GetImages = function ()
        {
            var q = $q.defer();
            if (!thiss.images.length)
            {
                var imgObj = new Firebase(config.fire_ImagesURL);
                var images = $firebaseArray(imgObj);
                images.$loaded(function (res) { thiss.images = res; q.resolve(FormArray(thiss.images)); })
            }
            else
            {
                q.resolve(thiss.images);
            }
            return q.promise;
        }
        this.slides = {};
        this.GetSlides = function ()
        {
            var q = $q.defer();
            if (!thiss.slides.length)
            {
                var slideObj = new Firebase(config.fire_SlidesURL);
                var slides = $firebaseArray(slideObj);
                slides.$loaded(function (res) { thiss.slides = res; q.resolve(thiss.slides); })
            }
            else
            {
                q.resolve(thiss.slides);
            }
            return q.promise;
        }
        this.pages = {};
        this.GetPages = function ()
        {
            var q = $q.defer();
            if (!thiss.pages.length)
            {
                var pageObj = new Firebase(config.fire_PagesURL);
                var pages = $firebaseArray(pageObj);
                pages.$loaded(function (res) { thiss.pages = res; q.resolve(thiss.pages); console.log('pages refreshed'); })
            }
            else
            {
                q.resolve(thiss.pages);
            }
            return q.promise;
        }
        this.GetPageDetails = function (name)
        {
            var pages = thiss.pages;
            console.log(pages);
            var page = pages ? pages.findAll('name', name.toLowerCase())[0] : undefined;
            return page ? page : { isLive: false, };
        }
        this.GetData = function GetData(name)
        {
            var q = $q.defer();
            if (!thiss[name])
            {
                var url = config['fire_' + name + 'URL'];
                console.log(url);
                var obj = new Firebase(url);
                var objs = $firebaseArray(obj);
                objs.$loaded(function (res)
                {
                    thiss[name] = res; q.resolve(FormArray(thiss[name]));
                    console.log(res)
                });
            } else
            {
                q.resolve(thiss[name]);
            }
            return q.promise;
        }
        this.Add = function (name, sermon)
        {
            var deferred = $q.defer();
            var srsObj = new Firebase(config.fire_SermonsURL);
            var sermons = $firebaseArray(srsObj);
            console.log('trig');
            sermons.$add(sermon).then(function (ref)
            {
                var id = ref.key();
                deferred.resolve(id);
            })
            return deferred.promise;
        }
        this.push = function push(objName, obj)
        {
            var firebase;
            firebase = new Firebase(config['fire_' + objName + 'URL']);
            firebase.push(obj);
        }
        this.remove = function push(objName, id)
        {
            var firebase;
            console.log(config['fire_' + objName + 'URL'] + '/' + id);
            firebase = new Firebase(config['fire_' + objName + 'URL'] + '/' + id);
            firebase.remove();
        }
        this.Edit = function Edit(name, newObj)
        {
            var deferred = $q.defer();
            var srs = new Firebase(config['fire_' + name + 'URL'] + '/' + newObj.$id);
            var sermon = $firebaseObject(srs);
            sermon = CopyObject(newObj, sermon);
            sermon.$save().then(function (res)
            {
                deferred.resolve(res);
            })
            return deferred.promise;
        }
        this.social = function ()
        {
            return {
                facebook: 'https://www.facebook.com/C3Victory/',
                twitter: 'https://twitter.com/c3victorysecbad',
                instagram: 'https://www.instagram.com/c3victorysecbad/'
            }
        }
        var CopyObject = function (oldObj, newObj)
        {
            var keys = Object.keys(oldObj);
            for (var i = 0 ; i < keys.length; i++)
            {
                var key = keys[i];
                newObj[key] = oldObj[key];
            }
            return newObj;
        }
        var FormArray = function (inObj)
        {
            var outObj = {};
            for (var i = 0; i < inObj.length; i++)
            {
                var str = inObj[i].$id;
                if (inObj[i].$value)
                    outObj[str] = inObj[i].$value;
                else
                {
                    var keys = Object.keys(inObj[i]);
                    for (var j = 0; j < keys.length; j++)
                    {
                        if (keys[j].indexOf('$') < 0)
                            outObj[keys[j]] = inObj[i][keys[j]];
                    }
                }
            }
            return outObj;
        }
    });
    app.service('config', function ($window)
    {
        var _this = this;
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
        this.RedirectToSermon = function (id)
        {
            $window.location.href = _this.sermonURL + id;
        }
        this.RedirectToSeries = function (id)
        {
            $window.location.href = _this.seriesURL + id;
        }
        this.default_series = function (serie)
        {
            return 'This sermon series was recorded on one of the Sunday services.';
        }
        this.mail_info = "info@c3victory.in";
        this.error = function (msg)
        {
            $window.location.href = '/error/' + msg;
        }
    })
})(angular)