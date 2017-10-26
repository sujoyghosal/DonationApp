var app = angular.module("myApp", [
    "ngRoute",
    "ui.bootstrap",
    "ui.directives",
    "ui.filters"
]);
app.config([
    "$routeProvider",
    function($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "Login.html",
                controller: "LoginCtrl"
            })
            .when("/home", {
                templateUrl: "bootstraphome.html",
                controller: "LoginCtrl"
            })
            .when("/register", {
                templateUrl: "Register.html",
                controller: "RegisterCtrl"
            })
            .when("/signup", {
                templateUrl: "Register.html",
                controller: "RegisterCtrl"
            })
            .when("/getdonation", {
                templateUrl: "ListDonations.html",
                controller: "DonationCtrl"
            })
            .when("/donationsaccepted", {
                templateUrl: "MyPickupList.html",
                controller: "DonationCtrl"
            })
            .when("/offerdonation", {
                templateUrl: "OfferDonation.html",
                controller: "DonationCtrl"
            })
            .when("/offershistory", {
                templateUrl: "MyOffers.html",
                controller: "DonationCtrl"
            })
            .when("/subscribe", {
                templateUrl: "Subscribe.html",
                controller: "DonationCtrl"
            })
            .when("/settings", {
                templateUrl: "settings.html",
                controller: "DonationCtrl"
            })
            .when("/subscribe", {
                templateUrl: "Subscribe.html",
                controller: "DonationCtrl"
            })
            .when("/sendnotification", {
                templateUrl: "SendPush.html",
                controller: "DonationCtrl"
            })
            .otherwise({
                redirectTo: "/login"
            });
    }
]);
app.service("UserService", function() {
    var loggedinUser = "";

    var setLoggedIn = function(newObj) {
        loggedinUser = newObj;
        //       console.log("New User = " + JSON.stringify(loggedinUser));
    };

    var getLoggedIn = function() {
        return loggedinUser;
    };

    return {
        setLoggedIn: setLoggedIn,
        getLoggedIn: getLoggedIn
    };
});
app.controller("LogoutCtrl", function($scope, UserService) {
    UserService.setLoggedIn("");
});
//app.controller('NavBarCtrl', function () { });
app.controller("OfferdonationCtrl", function(
    $scope,
    $http,
    $filter,
    UserService
) {
    $scope.spinner = false;
    $scope.login_email = UserService.getLoggedIn().email;
});

app.controller("DonationCtrl", function($scope, $http, $filter, UserService) {
    $scope.spinner = false;
    $scope.alldonations = false;
    $scope.citydonations = "";
    $scope.cancel = false;
    $scope.uuid = UserService.getLoggedIn().uuid;
    $scope.lat = "";
    $scope.lng = "";
    $scope.settings = adjustsettings(UserService.getLoggedIn().settings);
    $scope.selectedto = undefined;
    $scope.selectedfrom = undefined;

    $scope.login_email = UserService.getLoggedIn().email;
    $scope.found = "";
    $scope.result = "";
    $scope.groupusers = [];
    $scope.fullname = UserService.getLoggedIn().fullname;
    var param_name = "";
    $scope.offererUUID = "";

    $scope.reverseSort = false;
    var today = new Date().toISOString().slice(0, 10);
    $scope.today = {
        value: today
    };
    $scope.maxDate = {
        value: new Date(2015, 12, 31, 14, 57)
    };

    $scope.OrchestrateCreateOffer = function(offer) {
        $scope.GeoCodeAddress(offer.address);
        setTimeout($scope.SendOffer(offer), 3000);
    }
    $scope.GeoCodeAddress = function(offer) {
        $http({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAJBIQdfnhuEcSi6qFDoXCszJpRZxlSFZ0&address=" +
                offer.address
        }).then(
            function mySucces(response) {
                $scope.geoCodeResponse = response.data;
                $scope.geocodesuccess = true;
                $scope.lat = $scope.geoCodeResponse.results[0].geometry.location.lat;
                $scope.lng = $scope.geoCodeResponse.results[0].geometry.location.lng;
                console.log("Geocoding result: " + $scope.lat + "," + $scope.lng);
                $scope.SendOffer(offer);
                /* $scope.GetNearByATMs(
                           $scope.geoCodeResponse.results[0].geometry.location
                         );*/
            },
            function myError(response) {
                $scope.geoCodeResponse = response.statusText;
                $scope.lat = null;
                $scope.lng = null;
            }
        );
    };
    $scope.SendOffer = function(offer) {
        $scope.loginResult = "";
        var now = new Date();
        /*
                        var offerDate = new Date(offer.time);
                        alert("OfferDate=" + offerDate);
                        var now = new Date();
                        if (offerDate < now) {
                            $scope.loginResult = "donation date " + offerDate + " is in past. Please correct offer date.";
                            $scope.spinner = false;
                            return;
                        }
                        $scope.spinner = true;
                        var filteredtime = $filter('date')(offerDate, 'medium');

                        //   var filterdatetime = $filter('datetmUTC')( offerDate ); */

        $scope.GeoCodeAddress(offer.address);
        var sendURL =
            "http://localhost:9000/createdonations?email=" +
            $scope.login_email +
            "&offeredby=" +
            offer.name +
            "&phone_number=" +
            offer.phone +
            "&time=" +
            now +
            "&address=" +
            offer.address +
            "&city=" +
            offer.city +
            "&status=OFFERED" +
            "&from_place=" +
            offer.from +
            "&items=" +
            offer.items +
            "&latitude=" +
            $scope.lat +
            "&longitude=" +
            $scope.lng;
        $scope.loginResult = "Sent Request";

        $http({
            method: "GET",
            url: sendURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("Create Donation Response:" + JSON.stringify(response));
                $scope.loginResult = "Success";
                alert("Successufully Published Your Offer. Thank You!")
                $scope.spinner = false;
                $scope.status = response.statusText;
                /*              notifyUsersInGroup(
                                          "FROM-" +
                                          offer.city.trim().toUpperCase() +
                                          "-" +
                                          offer.from.trim().toUpperCase(),
                                          offer.from,
                                          filteredtime,
                                          offer.name,
                                          offer.phone
                                      );*/
                //      alert("Offer " + response.statusText);
                //   var MS_PER_MINUTE = 60000;
                //   var myStartDate = new Date(offerDate.valueOf() - 15 * MS_PER_MINUTE);
                //send notification to creator 15 min b4 donation starts
                //               schedulePush(new Date());
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "Error Received from Server.." + error.toString();
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };

    function schedulePush(time) {
        window.plugin.notification.local.add({
            date: time,
            message: "Your donation offer is in 15min. Please start."
        });
    }

    $scope.SendPush = function(gcmids, text) {
        if (!gcmids || !text) return;
        if (text.length === 0) {
            console.log("No text for push message. ");
            return;
        }
        $scope.spinner = true;

        var notifyURL = encodeURI(
            "http://localhost:9000/sendpush/devicespush?regids=" +
            gcmids +
            "&text=" +
            text
        );
        console.log("SendPush: notifyURL=" + notifyURL);
        $http({
            method: "GET",
            url: notifyURL
        }).then(
            function successCallback(response) {
                $scope.spinner = false;

                //   $scope.result = "Successfully Sent Push Messages to Subscribed Users for these locations.";
            },
            function errorCallback(error) {
                $scope.spinner = false;
                //          $scope.result = "Could not send push messages. ";
            }
        );
    };
    var notifyUsersInGroup = function(group, from, time, by, phone) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = "http://localhost:9000/getusersingroup?group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                var users = [];
                var gcmids = "";
                users = response.data;
                for (var i = 0; i < users.length; i++) {
                    if (!checkIfPushAllowedNow(users[i].settings)) continue;
                    var gcms = [];
                    gcms = users[i].gcm_ids;
                    for (var j = 0; j < gcms.length; j++) {
                        //   gcmids.push(gcms[j]);
                        gcmids += gcms[j] + "^";
                    }
                }

                $scope.SendPush(
                    gcmids,
                    "A new donation created by " +
                    by +
                    "(ph: " +
                    phone +
                    "), pickup at " +
                    time +
                    " from " +
                    from
                );

                // $scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldonations = false;
            }
        );
    };

    function checkIfPushAllowedNow(settingsObject) {
        //       console.log("checkIfPushAllowedNow: received input - " + JSON.stringify(settingsObject));
        if (settingsObject === undefined || !settingsObject) return true;

        if (settingsObject.pushon) {
            var start = new Date();
            start.setHours(
                settingsObject.pushstarttimehrs,
                settingsObject.pushstarttimemin
            );
            var stop = new Date();
            stop.setHours(
                settingsObject.pushstoptimehrs,
                settingsObject.pushstoptimemin
            );
            var timenow = new Date();
            if (stop < start) stop.setDate(timenow.getDate() + 1);
            if (stop == start) return true;
            if (timenow < start || timenow > stop) {
                return false;
            } else {
                return true;
            }
        } else return false;
    }

    $scope.GetDonations = function(paramname, paramvalue) {
        $scope.spinner = true;
        if (!paramname || !paramvalue) return;
        param_name = paramname.trim();
        var getURL =
            "http://localhost:9000/getdonations?paramname=" +
            param_name +
            "&paramvalue=" +
            paramvalue.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.citydonations = response.data;
                if (angular.isObject($scope.citydonations))
                    $scope.found = $scope.citydonations.length + " donations found";

                $scope.alldonations = true;
                $scope.cancel = false;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                //      $scope.result = "Could not submit acceptance. " + error;
                $scope.alldonations = false;
            }
        );
    };
    $scope.PopulateDefaultAddress = function() {
        var obj = UserService.getLoggedIn();
        $scope.address = JSON.stringify(obj.address);
    }
    $scope.OrchestrateGetNearbyDonations = function(data) {
        if (!data.searchAddress || data.searchAddress.length < 5) {
            alert("Please provide a valid address");
            return;
        }
        if (!data.distance) {
            alert("Please provide a valid distance");
            return;
        }
        $http({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAJBIQdfnhuEcSi6qFDoXCszJpRZxlSFZ0&address=" +
                data.searchAddress
        }).then(
            function mySucces(response) {
                $scope.geoCodeResponse = response.data;
                $scope.geocodesuccess = true;
                data.lat = $scope.geoCodeResponse.results[0].geometry.location.lat;
                data.lng = $scope.geoCodeResponse.results[0].geometry.location.lng;

                console.log("Geocoding result: " + data.lat + "," + data.lng);
                $scope.GetNearbyDonations(data);
            },
            function myError(response) {
                $scope.geoCodeResponse = response.statusText;
            }
        );
    };
    $scope.GetNearbyDonations = function(data) {
        $scope.spinner = true;
        if (!data.distance) {
            alert("Invalid Distance");
            return;
        }

        var getURL =
            "http://localhost:9000/vicinitydonations?radius=" +
            data.distance * 1000 + "&latitude=" + data.lat + "&longitude=" + data.lng;

        getURL = encodeURI(getURL);
        console.log("Vicinity Query: " + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(JSON.stringify(response));
                $scope.spinner = false;
                $scope.citydonations = response.data;
                if (angular.isObject($scope.citydonations))
                    $scope.found = $scope.citydonations.length + " donations found";

                $scope.alldonations = true;
                $scope.cancel = false;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                //      $scope.result = "Could not submit acceptance. " + error;
                $scope.alldonations = false;
            }
        );
    };

    function adjustsettings(settingsObject) {
        if (!settingsObject) return true;

        var start = new Date(settingsObject.pushstarttime);
        var stop = new Date(settingsObject.pushstoptime);
        var timenow = new Date();
        start.setFullYear(
            timenow.getFullYear(),
            timenow.getMonth(),
            timenow.getDate()
        );
        stop.setFullYear(
            timenow.getFullYear(),
            timenow.getMonth(),
            timenow.getDate()
        );
        if (stop < start) stop.setDate(timenow.getDate() + 1);
        settingsObject.pushstarttime = start;
        settingsObject.pushstoptime = stop;
        return settingsObject;
    }
    $scope.HaveIAcceptedThisdonation = function(row) {
        if (!row.receiver || receiver.length < 1)
            return false;
        if (row.receiver.receiver_email == UserService.getLoggedIn().email)
            return true;
        else
            return false;
    };

    $scope.Subscribe = function(data, type, user) {
        $scope.spinner = true;
        $scope.result = "Sending Request....";
        //first create group with id=<city>-<place>
        var getURL = "http://localhost:9000/creategroup?group=";
        var group = "";
        if (type === "to") {
            group =
                "TO-" +
                data.citySelect
                .toString()
                .trim()
                .toUpperCase() +
                "-" +
                data.to
                .toString()
                .trim()
                .toUpperCase();
        } else if (type === "from") {
            group =
                "FROM-" +
                data.citySelect
                .toString()
                .trim()
                .toUpperCase() +
                "-" +
                data.from
                .toString()
                .trim()
                .toUpperCase();
        } else return;

        getURL = encodeURI(getURL + group);
        $scope.result = getURL;
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                //     $scope.result = "SUCCESS ADDING GROUP " + group;
                var u = $scope.login_email;
                addUserToGroup(group, u);
                //$scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.found = "Could not submit acceptance. " + error;
                $scope.alldonations = false;
            }
        );
    };

    var addUserToGroup = function(group, user) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL =
            "http://localhost:9000/addusertogroup?group=" + group + "&user=" + user;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.result =
                    "SUCCESS ADDING SUBSCRIPTION TO PUSH MESSAGES FOR EVENT " + group;
                // $scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "ERROR ADDING SUBSCRIPTION TO PUSH MESSAGES ";
                $scope.alldonations = false;
            }
        );
    };

    var getUsersInGroup = function(group) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = "http://localhost:9000/getusersingroup?group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.groupusers = response;
                // $scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldonations = false;
            }
        );
    };

    function SendPushToUserByEmail(email, text) {
        $scope.spinner = true;
        var getURL = "http://localhost:9000/getuser?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                $scope.spinner = false;
                if (
                    angular.isObject(response) &&
                    response.data.toString() === "User Not Found"
                ) {
                    $scope.found = "Id Not Found";
                } else {
                    var obj = response.data[0];
                    if (!checkIfPushAllowedNow(obj.settings)) {
                        console.log(
                            "SendPushToUser: Prevented push as filtered by settings opitions. " +
                            ":" +
                            JSON.stringify(response.data.settings)
                        );
                        return;
                    } else {
                        console.log(
                            "SendPushToUser: Sending Push as filtered by settings opitions. " +
                            ":" +
                            JSON.stringify(response.data.settings)
                        );
                        SendPushToUser(obj.uuid, text);
                    }

                    return;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //      $scope.loginResult = "Could not submit login request.." + error;
                $scope.spinner = false;
                //      $scope.login_email = '';
            }
        );
    }
    $scope.NotifyDonor = function(email, text) {
        if (!email) {
            alert("ERROR - email NOT FOUND");
            $scope.found = "ERROR - Email NOT FOUND";
            return;
        }
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = "http://localhost:9000/getuser?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                var passengers = [];
                passengers = response.data;
                for (var i = 0; i < passengers.length; i++) {
                    var auuid = "";
                    auuid = passengers[i].uuid;
                    SendPushToUser(auuid, text);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.passengers = "ERROR GETTING PASSENGERS ";
            }
        );
    };

    function SendPushToUser(uuid, text) {
        //       alert("Sending Push TO User With UUID=" + uuid);
        //        return;
        $scope.spinner = true;
        if (!uuid) {
            $scope.found = "ERROR";
            console.log("SendPushToUser(uuid, text): No UUID received");
            return;
        }
        console.log(
            "Attempting to send push to uuid: " + uuid + " with text: " + text
        );
        //first create group with id=<city>-<place>
        var getURL = "http://localhost:9000/getuserbyuuid?uuid=" + uuid.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;

                if (!checkIfPushAllowedNow(response.data.settings)) {
                    console.log(
                        "SendPushToUser: Prevented push as filtered by settings opitions. " +
                        uuid +
                        ":" +
                        JSON.stringify(response.data.settings)
                    );
                    return;
                } else {
                    console.log(
                        "SendPushToUser: Sending Push as filtered by settings opitions. " +
                        uuid +
                        ":" +
                        JSON.stringify(response.data.settings)
                    );
                }

                var gcmidarray = [];
                gcmidarray = response.data.gcm_ids;
                console.log("SendPush GCMIDs=" + JSON.stringify(gcmidarray));
                var gcmids = "";
                if (gcmidarray && gcmidarray.length > 0) {
                    for (var i = 0; i < gcmidarray.length; i++) {
                        gcmids += gcmidarray[i] + "^";
                    }
                    $scope.SendPush(gcmids, text);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
            }
        );
    }
    $scope.SendSettings = function(settings) {
        $scope.result = "";
        $scope.spinner = true;
        var starttimehrs = new Date(settings.fromtime).getHours();
        var starttimemin = new Date(settings.fromtime).getMinutes();
        var stoptimehrs = new Date(settings.totime).getHours();
        var stoptimemin = new Date(settings.totime).getMinutes();

        $scope.spinner = true;
        var getURL =
            "http://localhost:9000/updateusersettings?uuid=" +
            $scope.uuid +
            "&starttimehrs=" +
            starttimehrs +
            "&starttimemin=" +
            starttimemin +
            "&stoptimehrs=" +
            stoptimehrs +
            "&stoptimemin=" +
            stoptimemin +
            "&pushon=" +
            settings.pushon;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.result = "SUCCESS SAVING YOUR SETTINGS ";
                // $scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "ERROR ADDING SUBSCRIPTION TO PUSH MESSAGES ";
                $scope.alldonations = false;
            }
        );
    };

    $scope.AcceptDonation = function(row, status) {
        $scope.uuid = "";
        $scope.result = "";
        $scope.spinner = true;
        var loggedinUser = UserService.getLoggedIn();
        var receiveTime = new Date();
        var filteredtime = $filter("date")(receiveTime, "medium");
        var updateURL =
            "http://localhost:9000/acceptdonation?uuid=" +
            row.uuid +
            "&receiver_name=" +
            loggedinUser.fullname +
            "&receiver_phone=" +
            loggedinUser.phone +
            "&receiver_email=" +
            loggedinUser.email +
            "&receiver_uuid=" +
            loggedinUser.uuid +
            "&received_time=" +
            filteredtime +
            "&status=" +
            status;
        console.log("Accept donation URL is: " + updateURL);
        $http({
            method: "GET",
            url: updateURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //alert(response)
                //   $scope.found  = "Accepted donation Successfully going from " + row.from + " to " + row.to + " at " + row.time;
                $scope.spinner = false;
                if (response.data === "Already Accepted") {
                    $scope.result = response.data;
                    $scope.uuid = row.uuid;
                    $scope.alldonations = true;
                    $scope.cancel = true;
                    return;
                } else {
                    $scope.result = ("successfully " + status).toUpperCase();
                    $scope.GetDonations("city", row.city);
                    $scope.uuid = row.uuid;
                    $scope.alldonations = true;
                    $scope.cancel = true;
                    SendPushToUserByEmail(
                        row.email,
                        "donation accepted by " + loggedinUser.fullname
                    );
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.accepteddonation = "Could not submit acceptance. " + error;
                $scope.cancel = false;
            }
        );
    };
    var accepts = [];

    $scope.GetdonationAcceptances = function(row, cancel) {
        $scope.spinner = true;
        var acceptsURL =
            "http://localhost:9000/getdonationacceptances?uuid=" + row.uuid;
        $http({
            method: "GET",
            url: acceptsURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                accepts = response.data.entities;
                if (cancel) $scope.Canceldonation(row, false);
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                alert("Could not submit acceptance. " + error);
                $scope.accepted = false;
            }
        );
    };

    $scope.GetAcceptedDonations = function(email) {
        $scope.spinner = true;
        var getURL =
            "http://localhost:9000/accepteddonations?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (angular.isArray(response.data)) {
                    $scope.citydonations = response.data;
                    // $scope.found  = "Active donation offers for " + param_name;
                    $scope.alldonations = true;
                    $scope.cancel = true;
                } else {
                    $scope.result = response.data;
                    // $scope.found  = "Active donation offers for " + param_name;
                    $scope.alldonations = false;
                    $scope.cancel = false;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.found = "Oops! There was a problem. " + error;
                $scope.alldonations = false;
            }
        );
    };
    $scope.CancelOffer = function(row) {
        $scope.spinner = true;
        var cancelURL = "http://localhost:9000/canceloffer?uuid=" + row.uuid;

        $http({
            method: "GET",
            url: cancelURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                alert("Successfully Cancelled.");
                $scope.cancel = true;
                $scope.GetDonations("email", $scope.login_email);
                $scope.result = "Successfully Cancelled This Offer";
                SendPushToUser(
                    row.receiver.receiver_uuid,
                    "A donation offered by " + $scope.fullname + " has been cancelled"
                );
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "Could not cancel. " + cancelURL;
                $scope.accepted = false;
                $scope.uuid = row.uuid;
                $scope.cancel = false;
                return;
            }
        );
    };

    $scope.Canceldonation = function(row, responseAsMessage) {
        //   $scope.uuid = '';
        //    $scope.GetdonationAcceptances(row);
        $scope.spinner = true;
        var cancelURL =
            "http://localhost:9000/cancelaccepteddonation?uuid=" +
            row.uuid +
            "&receiver_email=" +
            UserService.getLoggedIn().email;
        $http({
            method: "GET",
            url: cancelURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                alert("Successfully Cancelled.");
                if (responseAsMessage) {
                    $scope.GetMyAccepteddonations(login_email);
                    return;
                }
                $scope.uuid = row.uuid;
                $scope.cancel = true;
                $scope.Getdonations("city", row.city);
                $scope.result = "Cancelled donation";
                SendPushToUserByEmail(row.email, "donation cancelled by a passenger");
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "Could not cancel. ";
                $scope.accepted = false;
                $scope.uuid = row.uuid;
                $scope.cancel = false;
            }
        );
    };
});

app
    .controller("FundooCtrl", function($scope, $window) {
        $scope.rating = 5;
        $scope.saveRatingToServer = function(rating) {
            $window.alert("Rating selected - " + rating);
        };
    })
    .directive("fundooRating", function() {
        return {
            restrict: "A",
            template: '<ul class="rating">' +
                '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                "\u2605" +
                "</li>" +
                "</ul>",
            scope: {
                ratingValue: "=",
                max: "=",
                readonly: "@",
                onRatingSelected: "&"
            },
            link: function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({ filled: i < scope.ratingValue });
                    }
                };

                scope.toggle = function(index) {
                    if (scope.readonly && scope.readonly === "true") {
                        return;
                    }
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({ rating: index + 1 });
                };

                scope.$watch("ratingValue", function(oldVal, newVal) {
                    if (newVal) {
                        updateStars();
                    }
                });
            }
        };
    });

app.controller("LoginCtrl", function(
    $scope,
    $http,
    $location,
    $routeParams,
    UserService
) {
    $scope.spinner = false;

    $scope.isCollapsed = true;
    $scope.isVisible = function() {
        return ("/login" !== $location.path() && "/signup" !== $location.path());
    };

    $scope.showNav = "/login" !== $location.path();

    $scope.login_email = UserService.getLoggedIn().email;

    if (!angular.isObject($scope.login_email) || $scope.login_email.length == 0)
        $scope.showNav = false;
    else $scope.showNav = true;
    // alert($scope.showNav + "," + $scope.login_email.length);
    $scope.Login = function(login) {
        $scope.spinner = true;
        var getURL = "http://localhost:9000/loginuser?email=" + login.email.trim() + "&pw=" + login.password.trim();

        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //      $scope.loginResult = response.data;
                $scope.spinner = false;

                if (
                    angular.isObject(response) &&
                    response.data.toString() === "User Not Found"
                ) {
                    $scope.loginResult = "Id Not Found";

                    if (
                        window.confirm(
                            "Email ID not found in App database. Would you like to create an account with this id?"
                        ) == true
                    ) {
                        $location.path("/register");
                        return;
                    }
                } else {
                    //        alert("Id Found");
                    if (angular.isObject(response) &&
                        response.data.toString() === "Authentication Error") {
                        alert("Invalid Password");
                        return;
                    } else {
                        var obj = response.data[0];
                        UserService.setLoggedIn(obj);
                        $scope.loginResult = obj.username;
                        $scope.fullname = obj.fullname;
                        $scope.showNav = true;
                        $scope.login_email = obj.email;
                        $location.path("/home");
                        //                $scope.fullname = UserService.getLoggedIn().fullname;
                        return;
                    }
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //      $scope.loginResult = "Could not submit login request.." + error;
                $scope.spinner = false;

                $scope.loginResult = "Could not submit request..";
                //      $scope.login_email = '';
            }
        );
    };

    $scope.Logout = function() {
        $scope.login_email = "";
        UserService.setLoggedIn("");

        return;
    };
    $scope.OpenRegsiterForm = function() {
        $location.path("/register");
    };
});
app.controller("RegisterCtrl", function($scope, $http, $location, UserService) {
    $scope.spinner = false;

    $scope.CreateUser = function(user) {
        $scope.spinner = true;
        var getURL =
            "http://localhost:9000/createuser?email=" +
            user.email.trim() +
            "&phone=" +
            user.phone.trim() +
            "&fullname=" +
            user.fullname.trim() +
            "&password=" +
            user.password.trim() +
            "&address=" +
            user.address.trim();
        getURL = encodeURI(getURL);
        console.log("Create URL=" + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (
                    angular.isObject(response) &&
                    response.data.toString() === "CREATED"
                ) {
                    alert("Account Created with id " + user.email);

                    $location.path("/login");
                    return;
                } else {
                    $scope.result = response;
                    alert("Could not create user id");

                    //        $location.path("/login");
                    return;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.loginResult = "Could not submit request.." + error;
            }
        );
    };

});