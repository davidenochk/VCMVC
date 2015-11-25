angular.module('vc3app')
.service('AdminService', function (data,$q) {
    this.AddSermon = function (sermon) {
        //Push this object to the firebase
        var deferred = $q.defer();
        data.Add('Sermon', sermon).then(function (ref) {
            console.log('Ref in service', ref)
            deferred.resolve(ref);
        });
        return deferred.promise;
    }
    this.EditSermon = function (sermon, id) {
        //Write the new sermon details to the firebase
        var deferred = $q.defer();
        data.Edit('Sermon', sermon, id).then(function (ref) {
            console.log('Ref in Service', ref);
            deferred.resolve(ref);
        });
        return deferred.promise;
    }
})