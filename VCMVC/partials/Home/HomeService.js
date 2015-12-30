"use strict";

(function () {
    angular.module('vc3app')
    .service('HomeService', function (data, $q) {
        //Get the images, titles
        this.GetSlides = function () {
            var q = $q.defer();
            $q.all([data.GetSlides()]).then(function (response) {
                q.resolve(response[0]);
            })
            return q.promise;
        }
    })
})(angular)