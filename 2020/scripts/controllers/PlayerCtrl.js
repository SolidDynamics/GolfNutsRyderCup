var app = angular.module("GolfNutsApp", ['angular.filter', 'ngSanitize', 'ngCookies']);

app.controller("PlayerCtrl", function ($scope, $http) {

    var playersSpreadsheetID = "1pyT5v6kafKhZtzQa1mWyuuOd8F4Ni_NihH5uge7jpiA";
    // Make sure it is public or set to Anyone with link can view 
    var playersSpreadsheetUrl = "https://spreadsheets.google.com/feeds/list/" + playersSpreadsheetID + "/3/public/values?alt=json";

    $http.get(playersSpreadsheetUrl).
        then(function (data, status, headers, config) {
            var playersData = data.data.feed.entry;
            var matchesSpreadsheetID = "1pyT5v6kafKhZtzQa1mWyuuOd8F4Ni_NihH5uge7jpiA";
            // Make sure it is public or set to Anyone with link can view 
            var matchesSpreadsheetUrl = "https://spreadsheets.google.com/feeds/list/" + matchesSpreadsheetID + "/od6/public/values?alt=json";

            $http.get(matchesSpreadsheetUrl)
                .then(function (data, status, headers, config) {

                    
                    var playerList = [];
                    angular.forEach(playersData, function (player) {
                        var playerModel = {
                            playerName: player.gsx$name.$t, singleswon: 0,
                            singlesplayed: 0,
                            doubleswon: 0,
                            doublesplayed: 0,
                            totalmatchesplayed: 0,
                            pointsearned: 0,
                            potentialpoints: 0,
                            winpercentage: 0,
                            team: player.gsx$team.$t
                        };

                        angular.forEach(data.data.feed.entry, function (match) {
                            if (match.gsx$matchstatus.$t == 'complete') {
                                var isSingles = (match.gsx$type.$t == 'singles');
                                var winPoints = isSingles ? 1 : 2;
                                if (player.gsx$team.$t == 'red' && match.gsx$red.$t.match(playerModel.playerName)) {
                                    playerModel.totalmatchesplayed += 1;
                                    playerModel.potentialpoints += winPoints;

                                    if (isSingles) {
                                        playerModel.singlesplayed += 1;
                                        if (match.gsx$result.$t == 'red') {
                                            playerModel.singleswon += 1;
                                            playerModel.pointsearned += winPoints;
                                        }
                                        else if (match.gsx$result.$t != 'blue') {
                                            playerModel.singleswon += (1 / 2);
                                            playerModel.pointsearned += (winPoints / 2);
                                        }
                                    }
                                    else {
                                        playerModel.doublesplayed += 1;
                                        if (match.gsx$result.$t == 'red') {
                                            playerModel.doubleswon += 1;
                                            playerModel.pointsearned += winPoints;
                                        }
                                        else if (match.gsx$result.$t != 'blue') {
                                            playerModel.doubleswon += (1 / 2);
                                            playerModel.pointsearned += (winPoints / 2);
                                        }
                                    }
                                } else if (player.gsx$team.$t == 'blue' && match.gsx$blue.$t.match(playerModel.playerName)) {
                                    playerModel.totalmatchesplayed += 1;
                                    playerModel.potentialpoints += winPoints;

                                    if (isSingles) {
                                        playerModel.singlesplayed += 1;
                                        if (match.gsx$result.$t == 'blue') {
                                            playerModel.singleswon += 1;
                                            playerModel.pointsearned += winPoints;
                                        }
                                        else if (match.gsx$result.$t != 'red') {
                                            playerModel.singleswon += (1 / 2);
                                            playerModel.pointsearned += (winPoints / 2);
                                        }
                                    }
                                    else {
                                        playerModel.doublesplayed += 1;
                                        if (match.gsx$result.$t == 'blue') {
                                            playerModel.doubleswon += 1;
                                            playerModel.pointsearned += winPoints;
                                        }
                                        else if (match.gsx$result.$t != 'red') {
                                            playerModel.doubleswon += (1 / 2);
                                            playerModel.pointsearned += (winPoints / 2);
                                        }
                                    }
                                }
                            }
                        });

                        playerModel.winpercentage = (playerModel.potentialpoints == 0) ? -1 : (playerModel.pointsearned / playerModel.potentialpoints) * 100;
                        playerList.push(playerModel);
                    });


                    $scope.players = playerList;
                });

        },
        function (data, status, headers, config) {
            alert('Data: ' + data + '\nStatus: ' + status + '\nHeaders: ' + headers + '\nConfig: ' + headers);
        });
});