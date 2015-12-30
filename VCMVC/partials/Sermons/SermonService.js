"use strict";

(function () {
    angular.module('vc3app')
    .service('SermonService', function ($q, data) {
        //Get sermon details
        let _this = this;
        this.GetSermon = function (id)
        {
            var q = $q.defer();
            //Get Sermon Details of this id
            $q.all([data.GetSermons()]).then(function (response)
            {
                console.log(id);
                q.resolve(response[0].find('ID', id).ID ? response[0].find('ID', id) : response[0].find('ID', id.toString()));
            })
            return q.promise;
        }
    })
})(angular)