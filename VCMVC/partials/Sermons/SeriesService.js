﻿"use strict";

(function () {
    angular.module('vc3app')
    .service('SeriesService', function ($q, data) {
        //Get sermon details
        var _this = this;
        this.GetSeries = function (id) {
            var q = $q.defer();
            //Get Sermon Details of this id
            $q.all([data.GetSermons(), data.GetSeries()]).then(function (response) {
                //Send Series & it's sermon details
                //If there is no series with this id, then get the latest series
                console.log(response, id);
                var serie = response[1].find('ID', id.toString()).ID ? response[1].find('ID', id.toString()) : response[1][response[1].length - 1];
                var sermons = response[0].findAll('SeriesID', id);
                q.resolve({ series: serie, sermons: sermons });
            })
            return q.promise;
        }
    })
})(angular)