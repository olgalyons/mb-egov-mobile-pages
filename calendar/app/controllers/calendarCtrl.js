'use strict';
calendarApp.controller('calendarCtrl', function ($scope, $http, $q) {
    $.mobile.loading('show');
    var sDate = new Date();
    var eDate = new Date();
    var newDesc = '';
    $scope.calendars = [];
    var now = moment();
    var timeMin = now.format("YYYY-MM-DDTHH:mm:ssZZ");
    var timeMax = now.add('days', 7).format("YYYY-MM-DDTHH:mm:ssZZ");
    

    $scope.params = {
        singleEvents: true,
        timeMax: timeMax,
        timeMin: timeMin,
        key: 'AIzaSyCns826eC4W-1m5xSKgRqmoBrWv0k5n_Rg'
    };
    $scope.predicate = 'start';


    $scope.fetch = function () {
        var fetchEvents = $http.get('https://www.googleapis.com/calendar/v3/calendars/cmbevents%40gmail.com/events', { params: $scope.params });
        var fetchSanitation = $http.get('https://www.googleapis.com/calendar/v3/calendars/cmbsanitation%40gmail.com/events', { params: $scope.params });
        var fetchMeetings = $http.get('https://www.googleapis.com/calendar/v3/calendars/cmbmeetings%40gmail.com/events', { params: $scope.params });
        var fetchParks = $http.get('https://www.googleapis.com/calendar/v3/calendars/cmbparks%40gmail.com/events', { params: $scope.params });

        $q.all([fetchEvents, fetchSanitation, fetchMeetings, fetchParks]).then(function (results) {
            angular.forEach(results, function (val, key) {
                angular.forEach(val.data.items, function (val, key) {
                    if (HasProperty(val.start, 'date')) {
                        sDate = Date.parse(val.start.date);
                        eDate = Date.parse(val.end.date);

                    }
                    if (HasProperty(val.start, 'dateTime')) {
                        sDate = Date.parse(val.start.dateTime);
                        eDate = Date.parse(val.end.dateTime);

                    }
                    var description = !val.description ? 'N/A' : val.description;
                    $scope.calendars.push(new Calendar(val.summary, description, sDate, eDate, val.location));
                    $.mobile.loading('hide');

                });
            });
            
        });

    
    }
   
    $scope.fetch();

    function HasProperty(val, prop) {
        if (val.hasOwnProperty(prop)) {
            return true;
        }
    }
    function Calendar(summary, desc, start, end, loc) {
        var self = this;
        self.summary = summary;
        self.description = desc;
        self.start = start;
        self.end = end;
        self.location = loc;
    }
});