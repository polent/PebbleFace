/**
 * SapientNitro Cities
 * Will get Cities and current location
 * Displaying the nearest Office
 * Optional - Update
 */


localStorage.removeItem('offices');

var UI = require('ui');
//var Vector2 = require('vector2');
var ajax = require('ajax');

var localStorageKey = 'offices';
var officeMenu;
var URL = 'http://polente.de/snoffices/offices.json';
var watchCoords;

var locationOptions = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
};



var getOfficeData = function () {
    'use strict';
    return localStorage.getItem(localStorageKey);
};
var setOfficeData = function (json) {
    'use strict';
    localStorage.setItem(localStorageKey, JSON.stringify(json));
};


// Show splash
var splashCard = new UI.Card({
    title: 'Please Wait',
    body: 'Fetching Cities and location...'
});
splashCard.show();



var sortArray = function(distArray) {
    distArray.sort(function (a, b) {
        if (a.dist > b.dist) {
            return 1;
        }
        if (a.dist < b.dist) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
};

var showNearestOffices = function (distArray) {
    'use strict';
    sortArray(distArray);
    officeMenu = new UI.Menu({
        sections: [{
            title: 'Nearest Offices:',
            items: distArray
        }]
    });
    officeMenu.show();
    splashCard.hide();
};

var getNearestCity = function () {
    'use strict';
    var dist;
    var officeArray = JSON.parse(getOfficeData()).offices;
    var distArray = [];
    var officeArrayLength = officeArray.length;
    var tmpOffices, tmpLat, tmpLong;
    var i;
    for (i = 0; i < officeArrayLength; i ++) {
        tmpOffices = officeArray[i];
        tmpLat = parseInt(tmpOffices.coords.lat, 10);
        tmpLong = parseInt(tmpOffices.coords.long, 10);

        dist = (tmpLat - watchCoords.latitude) * (tmpLat - watchCoords.latitude) + ((tmpLong - watchCoords.longitude) * 2) * ((tmpLong - watchCoords.longitude) * 2);
        tmpOffices.dist = dist;
        distArray.push(tmpOffices);
        //console.log('Office: ' + tmpOffices.title + ' - Dist: ' + dist);
    }
    showNearestOffices(distArray);
};


var locationSuccess = function (pos) {
    'use strict';
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
    watchCoords = pos.coords;
    getNearestCity();
};

var locationError = function (err) {
    'use strict';
    console.log('location error (' + err.code + '): ' + err.message);
};


var getCurrentPos = function() {
    'use strict';
    // Make an asynchronous request
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
};


//If Cities are set use local ones
//Initialize the App
if (getOfficeData()) {
    getCurrentPos();
} else {

    // Download data
    ajax({url: URL, type: 'json'},
      function(json) {
        setOfficeData(json);
        getCurrentPos();
      },
      function(error) {
        console.log('Ajax failed: ' + error);
      }
    );

}























