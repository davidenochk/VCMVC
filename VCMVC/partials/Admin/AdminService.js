"use strict";
(function () {
    var app = angular.module('vc3app');
    app.service('AdminService', function (data, $q) {
        //Get Series
        //Get Sermons
        //Get Speakers
        //Get Images
        this.GetAllData = function () {
            var q = $q.defer();
            //Wait for the sermons, series & speakers to load
            $q.all([data.GetSeries(), data.GetSermons(), data.GetSpeakers(), data.GetImages()]).then(
            function (res) {
                //Series & Sermons are loaded
                q.resolve(res);
            })
            return q.promise;
        }
    })
})(angular);