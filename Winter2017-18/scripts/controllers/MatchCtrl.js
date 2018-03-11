app.controller("MatchCtrl", function ($scope, $http, $filter, $window) {
    var spreadsheetID = "1-uI2Te0UaqJsxNFeUW6QxJZl3llsQMW3f0UmJAT3Iz0";
    // Make sure it is public or set to Anyone with link can view 
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

    $http.get(url).
      then(function (data, status, headers, config) {
          var orderBy = $filter('orderBy');
          $scope.matches = orderBy(data.data.feed.entry, 'gsx$matchdate', true);

          var overallStandings = { red:0, blue:0 };

          angular.forEach($scope.matches, function (match) {
              if (match.gsx$matchstatus.$t == "complete")
              {
                  if (match.gsx$result.$t == "red") {
                      this.red += match.gsx$type.$t == "singles" ? 1 : 2;
                  }
                  else if (match.gsx$result.$t == "blue") {
                      this.blue += match.gsx$type.$t == "singles" ? 1 : 2;
                  }
                  else {
                      this.red += match.gsx$type.$t == "singles" ? 0.5 : 1;
                      this.blue += match.gsx$type.$t == "singles" ? 0.5 : 1;
                  }
              }
          }, overallStandings)

          var roundedRedScore = $window.Math.floor(overallStandings.red);
          $scope.redScore = roundedRedScore.toString() + (overallStandings.red - roundedRedScore != 0 ? "&#189;" : "");
          var roundedBlueScore = $window.Math.floor(overallStandings.blue);
          $scope.blueScore = roundedBlueScore.toString() + (overallStandings.blue - roundedBlueScore != 0 ? "&#189;" : "");

      },
      function (data, status, headers, config) {
          alert('Data: ' + data + '\nStatus: ' + status + '\nHeaders: ' + headers + '\nConfig: ' + headers);
      });
});
