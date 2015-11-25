"use strict";

(function () {
    angular.module('vc3app')
    .service('HomeService', function (data, $q) {
        //Get the images, titles
        this.GetSlides = function () {
            var q = $q.defer();
            $q.all([data.GetSlides()]).then(function (response) {
                GetSlides(response[0]);
                q.resolve(response[0]);
            })
            return q.promise;
        }
        var GetSlides = function (slides) {
            console.log(slides);
            var res = {};
            for (var i = 0; i < slides.length; i++) {
                var key = Object.keys(slides[i])[0];
                res[key] = slides[i][key];
            }
            console.log(res);
            return res;
        }
    })
})(angular)