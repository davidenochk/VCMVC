"use strict";
Array.prototype.find = function (c, v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][c] === v) {
            return this[i];
        }
    }
    return [];
};
Array.prototype.findAll = function (c, v) {
    var r = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][c] === v) {
            r.push(this[i]);
        }
    }
    return r;
};
function comp(a, b) {
    return -new Date(a.On).getTime() + new Date(b.On).getTime();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



var CreateSermon = function (sermon) {
    var newSermon = {};
    newSermon.ID = sermon.SERMONID;
    newSermon.Name = sermon.SERMONNAME;
    newSermon.About = sermon.SERMONDESCRIPTION;
    newSermon.Date = sermon.SERMONDATE;
    newSermon.By = sermon.SERMONBY;
    newSermon.Place = sermon.SERMONPLACE;
    newSermon.SeriesID = sermon.SERIESID;
    newSermon.Audio = sermon.AUDIOLINK;
    newSermon.Video = sermon.VIDEOLINK;
    newSermon.Art = sermon.ARTLINK;
    newSermon.SmallArt = sermon.ARTSMALLLINK;
    newSermon.Status = sermon.SERMONSTATUS;
    return newSermon;
}
var CreateSeries = function (series) {
    var newSeries = {};
    newSeries.ID = series.SERIESID;
    newSeries.Name = series.SERIESNAME;
    newSeries.About = series.SERIESDESCRIPTION;
    newSeries.By = series.SERIESBY;
    newSeries.Status = series.SERIESSTATUS;
    newSeries.Art = series.ARTLINK;
    newSeries.SmallArt = series.ARTSMALLLINK;
    return newSeries;
}
var CreateSpeaker = function (speaker) {
    var newSpeaker = {};
    newSpeaker.ID = speaker.SPEAKERID;
    newSpeaker.Name = speaker.SPEAKERNAME;
    return newSpeaker;
}
angular.module('Util', [])
.service('progress', function () {
    var progress = {
        count : 0
    }
    this.inc = function () {
        progress.count++;
    }
    this.dec = function () {
        progress.count--;
    }
    this.GetCount = function () {
        return progress;
    }
})
//var exports = module.exports = {};
//exports.CreateSermon = function (sermon) {
//    return CreateSermon(sermon);
//}
//exports.CreateSeries = function (series) {
//    return CreateSeries(series);
//}
//exports.CreateSpeaker = function (speaker) {
//    return CreateSpeaker(speaker);
//}