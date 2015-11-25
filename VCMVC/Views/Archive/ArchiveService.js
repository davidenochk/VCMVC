/**
 * @description : This service feeds and sets the sermonsList, currentSermon
 * @param : Uses dataService to get the sermons & series lists
 */
var app = angular.module('vc3app');
app.service('ArchiveService', function (data, $q) {
    var thiss = this;
    this.GetArchive = function () {
        var q = $q.defer();
        //Wait for the sermons, series & speakers to load
        $q.all([data.GetSeries(), data.GetSermons(), data.GetSpeakers()]).then(
        function (res) {
            //Series & Sermons are loaded
            thiss.Archive = GetArchiveList();
            q.resolve({ archive: thiss.Archive, series: data.series });
        })
        return q.promise;
    }
    /**
     * @description Returns the list of sermons to be displayed in archive
     * If the sermon is a part of a series, even series goes with the sermon as an object with name SERIES
     */
    var GetArchiveList = function GetArchiveList() {
        var sermons = data.sermons;
        //Sort by date
        sermons.sort(comp);
        var result = [];
        //Find for each seriesid other than 0
        for (var i = 0; i < sermons.length; i++) {
            var serie = data.series.find('SeriesID', sermons[i].SeriesID);
            if (sermons[i]['SeriesID'] === 0) {
                //Add nothing
                result.push(sermons[i]);
            }
            else if (result.find('SeriesID', sermons[i]['SeriesID']).length == 0) {
                //Add series name and series status
                sermons[i].SERIES = serie;
                result.push(sermons[i]);
            }
        }
        return result;
    }
});