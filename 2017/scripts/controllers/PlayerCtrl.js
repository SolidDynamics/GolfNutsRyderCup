﻿var app = angular.module("GolfNutsApp", ['angular.filter', 'ngSanitize', 'ngCookies']);

app.controller("PlayerCtrl", function ($scope, $http) {
    $http.get('data/players.json').
      then(function (data, status, headers, config) {
          var playersData = data.data.players;

          var spreadsheetID = "1fGb5D9vVyv6UXg-1khBt2cOoahLU962mdLUMzQxN5vs";
          // Make sure it is public or set to Anyone with link can view 
          var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

          $http.get(url)
          .then(function (data, status, headers, config) {
              var playerList = [];
              angular.forEach(playersData, function (player) {
                  var playerModel = {
                      playerName: player.firstName.substring(0, 1) + ' ' + player.lastName, singleswon: 0,
                      singlesplayed: 0,
                      doubleswon: 0,
                      doublesplayed: 0,
                      totalmatchesplayed: 0,
                      pointsearned: 0,
                      potentialpoints: 0,
                      winpercentage: 0,
                      team: player.team
                  };

                  angular.forEach(data.data.feed.entry, function (match) {
                      if (match.gsx$matchstatus.$t == 'complete') {
                          var isSingles = (match.gsx$type.$t == 'singles');
                          var winPoints = isSingles ? 1 : 1;
                          if (player.team == 'red' && match.gsx$red.$t.match(playerModel.playerName)) {
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
                          } else if (player.team == 'blue' && match.gsx$blue.$t.match(playerModel.playerName)) {
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