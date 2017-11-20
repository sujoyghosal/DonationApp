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
                controller: "LoginCtrl",
                isLogin: true
            })
            .when("/home", {
                templateUrl: "bootstraphome.html",
                controller: "LoginCtrl"
            })
            .when("/register", {
                templateUrl: "Register.html",
                controller: "RegisterCtrl"
            })
            .when("/updateuser", {
                templateUrl: "UpdateProfile.html",
                controller: "RegisterCtrl"
            })
            .when("/updatepassword", {
                templateUrl: "UpdateProfile.html",
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
            .when("/createneed", {
                templateUrl: "CreateNeed.html",
                controller: "DonationCtrl"
            })
            .when("/createemergency", {
                templateUrl: "CreateEmergency.html",
                controller: "DonationCtrl"
            })
            .when("/viewneeds", {
                templateUrl: "NeedsNearby.html",
                controller: "DonationCtrl"
            })
            .when("/viewemergencies", {
                templateUrl: "ViewEmergencies.html",
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
            .when("/unsubscribe", {
                templateUrl: "Unsubscribe.html",
                controller: "DonationCtrl"
            })
            .when("/sendnotification", {
                templateUrl: "SendPush.html",
                controller: "DonationCtrl"
            })
            .when("/notifications", {
                templateUrl: "Notifications.html",
                controller: "DonationCtrl"
            })
            .when("/resetpw", {
                templateUrl: "ResetPassword.html",
                controller: "RegisterCtrl"
            })
            .otherwise({
                redirectTo: "/login"
            });
    }
]);
app.service("DataService", function() {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
    var response = "";

    function whatIsIt(object) {
        if (object === null) {
            response = "null";
            return response;
        } else if (object === undefined) {
            response = "undefined";
            return response;;
        } else if (object.constructor === stringConstructor) {
            response = "String";
            return response;;
        } else if (object.constructor === arrayConstructor) {
            response = "Array";
            return response;
        } else if (object.constructor === objectConstructor) {
            response = "Object";
            return response;
        } else {
            response = "don't know";
            return response;
        }
    }

    function isValidArray(object) {
        whatIsIt(object);
        if (response === "Array")
            return true;
        else
            return false;
    }

    function isValidObject(object) {
        whatIsIt(object);
        if (response === "Object")
            return true;
        else
            return false;
    }

    function isNull(object) {
        whatIsIt(object);
        if (response === "null")
            return true;
        else
            return false;
    }

    function isString(object) {
        whatIsIt(object);
        if (response === "String")
            return true;
        else
            return false;
    }

    function isUnDefined(object) {
        whatIsIt(object);
        if (response === "don't know" || response === "undefined")
            return true;
        else
            return false;
    }
    return {
        whatIsIt: whatIsIt,
        isValidArray: isValidArray,
        isValidObject: isValidObject,
        isNull: isNull,
        isString: isString,
        isUnDefined: isUnDefined,
    };
});

app.service("UserService", function() {
    var loggedinUser = {};
    var isLoggedIn = false;
    var setLoggedIn = function(newObj) {
        loggedinUser = newObj;
        //       console.log("New User = " + JSON.stringify(loggedinUser));
    };

    var getLoggedIn = function() {
        return loggedinUser;
    };

    var setLoggedInStatus = function(state) {
        isLoggedIn = state;
    }
    var getLoggedInStatus = function() {
        return isLoggedIn;
    }
    return {
        setLoggedIn: setLoggedIn,
        getLoggedIn: getLoggedIn,
        setLoggedInStatus: setLoggedInStatus,
        getLoggedInStatus: getLoggedInStatus,
    };
});
var BASEURL = "https://freecycleapissujoy.mybluemix.net";
//var BASEURL = "http://localhost:9000";
//var PORT = (process.env.VCAP_APP_PORT || 9000);
var GEOCODEURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA_sdHo_cdsKULJF-upFVP26L7zs58_Zfg";

app.controller("DonationCtrl", function($scope, $rootScope, $http, $filter, $location, $timeout, $window, UserService, DataService) {
    $scope.spinner = false;
    $scope.alldonations = false;
    $scope.allneeds = false;
    var socket = null;
    $rootScope.username = UserService.getLoggedIn().fullname;
    $scope.citydonations = "";
    $scope.cancel = false;
    $scope.uuid = UserService.getLoggedIn().uuid;
    $scope.lat = "";
    $scope.lng = "";
    $scope.settings = adjustsettings(UserService.getLoggedIn().settings);
    $scope.selectedto = undefined;
    $scope.selectedfrom = undefined;
    $scope.login_email = UserService.getLoggedIn().email;
    $scope.login_fullname = UserService.getLoggedIn().fullname;
    $scope.login_phone = UserService.getLoggedIn().phone;
    $scope.found = "";
    $scope.result = "";
    $scope.groupusers = [];
    var param_name = "";
    $scope.offererUUID = "";
    $scope.reverseSort = false;
    //$scope.eventsCount = 0;
    $scope.events = [];
    var today = new Date().toISOString().slice(0, 10);
    $scope.today = {
        value: today
    };
    $scope.maxDate = {
        value: new Date(2015, 12, 31, 14, 57)
    };

    $scope.isVisible = function() {
        return ("/login" !== $location.path() && "/signup" !== $location.path() &&
            "/resetpw" !== $location.path() && "/updatepassword" !== $location.path());
    };
    $rootScope.$on("CallGetEventsMethod", function() {
        $scope.GetEventsForUser(true);
    });
    $rootScope.$on("CallGetGroupsForUserMethod", function() {
        $scope.GetGroupsForUser();
    });
    $rootScope.$on('$routeChangeStart', function(event, next) {

        if (!UserService.getLoggedInStatus() && "/signup" !== $location.path() &&
            "/resetpw" !== $location.path() &&
            "/updatepassword" !== $location.path()) {
            //console.log("User not logged in for access to " + $location.path());
            /* You can save the user's location to take him back to the same page after he has logged-in */
            //$rootScope.savedLocation = $location.url();

            $location.path("/login");
            return;
        }

    });
    /*setInterval(function() {
        $scope.GetEventsForUser(true);
    }, 60000);*/

    $scope.OrchestrateCreateOffer = function(offer) {
        $scope.GeoCodeAddress(offer.address, "offer");
        setTimeout($scope.SendOffer(offer), 3000);
    }
    $scope.OrchestrateCreateNeed = function(need) {
        $scope.GeoCodeAddress(need.address, "need");
        setTimeout($scope.CreateNeed(need), 3000);
    }
    $scope.GeoCodeAddress = function(offer, func) {
        console.log("GeoCode URL=" + GEOCODEURL + "&address=" +
            offer.address);

        $http({
            method: "GET",
            url: GEOCODEURL + "&address=" + offer.address
        }).then(
            function mySucces(response) {
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.results)) {
                    console.log("####Invalid response")
                    swal("Error", "A problem occured!", "error");
                    return;
                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.geoCodeResponse = response.data;
                $scope.geocodesuccess = true;
                $scope.lat = $scope.geoCodeResponse.results[0].geometry.location.lat;
                $scope.lng = $scope.geoCodeResponse.results[0].geometry.location.lng;
                if (func && func === 'need') {
                    console.log("Creating Need...");
                    $scope.CreateNeed(offer, false);
                } else if (func && func === 'emergency') {
                    console.log("Creating Emergency...");
                    $scope.CreateNeed(offer, true);
                } else if (func && func === 'offer') {
                    console.log("Creating Offer...");
                    $scope.SendOffer(offer);
                } else {
                    console.log("No action after Geocoding");
                    //alert("Could Not Submit Request");
                    swal("Hmmm..some issues", "Could Not Submit Request.", "error");
                }
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

    $scope.ShowDirections = function(address) {
        $window.open("https://www.google.com/maps?saddr=My+Location&daddr=" + address + "/", "_blank");
    };

    $scope.GetFontAwesomeIconsForCategory = function(category) {
        var icon = '';

        switch (category) {
            case "Electronics":
                icon = "fa fa-mobile fa-2x";
                break;
            case "Fashion":
                icon = "fa fa-female fa-2x";
                break;
            case "Educational":
                icon = "fa fa-university fa-2x";
                break;
            case "Blood":
                icon = "fa fa-tint fa-2x";
                break;
            case "Medical":
                icon = "fa fa-stethoscope fa-2x";
                break;
            case "Food":
                icon = "fa fa-cutlery fa-2x";
                break;
            case "Furniture":
                icon = "fa fa-bed fa-2x";
                break;
            case "Clothes":
                icon = "fa fa-shirtsinbulk fa-2x";
                break;
            case "Sports":
                icon = "fa fa-futbol-o fa-2x";
                break;
            case "Household":
                icon = "fa fa-home fa-2x";
                break;
            case "Shoes":
                icon = "fa fa-tags fa-2x";
                break;
            case "Other":
                icon = "fa fa-star fa-2x";
            case "Natural Disaster":
                icon = "fa fa-fire fa-2x";
                break;
            case "Terrorism":
                icon = "fa fa-bomb fa-2x";
                break;
            case "Accident":
                icon = "fa fa-ambulance fa-2x";
                break;
            case "Women's Safety":
                icon = "fa fa-life-ring fa-2x";
                break;
            case "Children's Safety":
                icon = "fa fa-child fa-2x";
                break;
            default:
                icon = "fa fa-star fa-2x";
        }
        console.log("GetFontAwesomeIconsForCategory: Category=" + category + ", Icon=>" + icon);
        return icon;
    };
    $scope.SendOffer = function(offer) {
        $scope.loginResult = "";
        var now = new Date();
        var sendURL =
            BASEURL + "/createdonations?email=" +
            $scope.login_email +
            "&offeredby=" +
            $scope.login_fullname +
            "&phone_number=" +
            $scope.login_phone +
            "&time=" +
            now +
            "&address=" +
            offer.address +
            "&city=" +
            offer.city +
            "&status=OFFERED" +
            "&itemtype=" +
            offer.itemtype +
            "&fa_icon=" + $scope.GetFontAwesomeIconsForCategory(offer.itemtype) +
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
                //alert("Successufully Published Your Offer. Thank You!");
                swal("Good job!", "Successufully Published Your Offer. Thank You!", "success");
                $scope.spinner = false;
                $scope.status = response.statusText;
                offer.type = "DonationOffer";
                $scope.CheckIfGroupExists(offer);
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
    $scope.CheckIfGroupExists = function(event) {
        var group = "EVENT-" + event.city.trim().toUpperCase().replace(/ /g, "-") + "-" + event.itemtype.trim().toUpperCase().replace(/ /g, "-");

        var sendURL =
            BASEURL + "/getgroupbyname?group=" + group;

        $http({
            method: "GET",
            url: sendURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                if (response && response.data && response.data.entities && response.data.entities.length > 0) {
                    $scope.loginResult = "Success";
                    //alert("This Offer Has inetersted Users, notifying them now.");
                    //swal("People want this!", "This Offer Has inetersted Users, notifying them now.", "info");
                    console.log("CheckIfGroupExists: Groups exists for event " + group);
                    $scope.spinner = false;
                    // Connect event uuid with group name
                    $scope.CreateEvent(event, response.data.entities[0].uuid, group);
                } else {
                    console.log("CheckIfGroupExists: Group does not exists: " + group);
                    $scope.spinner = false;
                }
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

    $scope.CreateNeed = function(need, emergency) {
        $scope.loginResult = "";
        var now = new Date();
        var sendURL =
            BASEURL + "/createneed?email=" +
            $scope.login_email +
            "&postedby=" +
            $scope.login_fullname +
            "&phone_number=" +
            $scope.login_phone +
            "&time=" +
            now +
            "&address=" +
            need.address +
            "&city=" +
            need.city +
            "&status=NEEDED" +
            "&itemtype=" +
            need.itemtype +
            "&fa_icon=" + $scope.GetFontAwesomeIconsForCategory(need.itemtype) +
            "&items=" +
            need.items +
            "&latitude=" +
            $scope.lat +
            "&longitude=" +
            $scope.lng +
            "&emergency=" + emergency;
        $scope.loginResult = "Request Sent";
        console.log("Create Need URL = " + sendURL);
        $http({
            method: "GET",
            url: sendURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                //alert("Successufully Published Your Need. Thank You!");
                swal("Good job!", "Successufully Published. Thank You!", "success");
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
                if (emergency && response) {
                    $scope.CheckIfGroupExists(need);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "A problem occurred processing the request. Please try again later.";
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };
    $scope.Redirect = function(url) {
        $location.path(url);
    }

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
            BASEURL + "/sendpush/devicespush?regids=" +
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
    $scope.CreateEvent = function(event, group_uuid, group_name) {
        $scope.loginResult = "";
        var now = new Date();
        var sendURL =
            encodeURI(BASEURL + "/createevent?email=" +
                $scope.login_email +
                "&postedby=" +
                $scope.login_fullname +
                "&phone_number=" +
                $scope.login_phone +
                "&time=" +
                now +
                "&address=" +
                event.address +
                "&city=" +
                event.city +
                "&items=" +
                event.items +
                "&latitude=" +
                $scope.lat +
                "&longitude=" +
                $scope.lng +
                "&itemtype=" +
                event.itemtype +
                "&fa_icon=" +
                $scope.GetFontAwesomeIconsForCategory(event.itemtype) +
                "&group_uuid=" + group_uuid + "&group_name=" + group_name);
        $http({
            method: "GET",
            url: sendURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                $scope.spinner = false;
                $scope.status = response.statusText;
                // Connect event uuid with group name
                //$scope.ConnectEntities(group, response.data._data.uuid);
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
    $scope.ConnectEntities = function(uuid1, uuid2) {
        if (!uuid1 || !uuid2) {
            console.log("ConnectEntities - Invalid Parameters");
            return;
        }
        var getURL =
            BASEURL + "/connectentities?uuid1=" + uuid1 + "&uuid2=" + uuid2;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("Successful Connection of Entities");
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Failed to connect entities");
            }
        );
    };
    var notifyUsersInGroup = function(group, from, time, by, phone) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getusersingroup?group=" + group;
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

    $scope.GetDonations = function(paramname, paramvalue, myoffers) {
        if (!paramvalue || paramvalue.length < 2) {
            swal("Need " + paramname, "Please provide a valid " + paramname, "warning");
            return;
        }
        $scope.spinner = true;
        param_name = paramname.trim();
        var getURL =
            BASEURL + "/getdonations?paramname=" +
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
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        swal("Error", "A problem occured!", "error");
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        swal("Error", "A problem occured!", "error");
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.citydonations = response.data;

                //Show only newer offers
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filteredDonations = [];

                if ($scope.citydonations && $scope.citydonations.length > 0) {
                    for (var i = 0; i < $scope.citydonations.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.citydonations[i].modified);
                        if (!myoffers) {
                            if (((d - o) > 7 * ONE_DAY) || $scope.citydonations[i].email === $scope.login_email)
                                continue;
                            else
                                filteredDonations.push($scope.citydonations[i]);
                        } else {
                            filteredDonations.push($scope.citydonations[i]);
                        }
                    }
                    console.log("Filtered " + ($scope.citydonations.length - filteredDonations.length) + " old records");
                    $scope.citydonations = filteredDonations;
                    $scope.found = "Found " + $scope.citydonations.length + " offers";
                } else {
                    $scope.found = "No Offers Found";
                }
                if ($scope.citydonations.length == 0) {
                    $scope.alldonations = false;
                    return;
                }
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
    $scope.GetNeeds = function(paramname, paramvalue, emergency) {
        if (!paramvalue || paramvalue.length < 2) {
            swal("Need " + paramname, "Please provide a valid " + paramname, "warning");
            return;
        }
        $scope.spinner = true;
        param_name = paramname.trim();
        var getURL =
            BASEURL + "/getneeds?paramname=" +
            param_name +
            "&paramvalue=" +
            paramvalue.trim() + "&emergency=" + emergency;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        swal("Error", "A problem occured!", "error");
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        swal("Error", "A problem occured!", "error");
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.cityneeds = response.data;
                //    if (angular.isObject($scope.cityneeds))
                //       $scope.found = $scope.cityneeds.length + " found";
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filteredNeeds = [];
                if ($scope.cityneeds && $scope.cityneeds.length > 0) {
                    for (var i = 0; i < $scope.cityneeds.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.cityneeds[i].modified);
                        if ((d - o) > 7 * ONE_DAY)
                            continue;
                        else if (!emergency && $scope.cityneeds[i].email === $scope.login_email)
                            continue;
                        else
                            filteredNeeds.push($scope.cityneeds[i]);
                    }
                    console.log("Filtered " + ($scope.cityneeds.length - filteredNeeds.length) + " old records");
                    $scope.cityneeds = filteredNeeds;
                    $scope.found = $scope.cityneeds.length + " found";
                    if ($scope.cityneeds.length == 0) {
                        $scope.allneeds = false;
                        return;
                    }
                } else {
                    $scope.cityneeds = [];
                    $scope.found = "None found";
                }
                $scope.allneeds = true;
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
    $scope.OrchestrateGetNearby = function(data, type) {
        if (!data || !data.searchAddress || data.searchAddress.length < 5) {
            //alert("Please provide a valid address");
            swal("Need Address", "Please provide a valid address", "warning");
            return;
        }
        if (!data.distance) {
            //alert("Please provide a valid distance");
            swal("Need Radius", "Please select distance", "warning");
            return;
        }
        $http({
            method: "GET",
            url: GEOCODEURL + "&address=" + data.searchAddress
        }).then(
            function mySucces(response) {
                console.log("URL=" + GEOCODEURL + "&address=" + data.searchAddress);
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.results)) {
                    console.log("####Invalid response")
                    swal("Error", "A problem occured!", "error");
                    return;
                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.geoCodeResponse = response.data;
                $scope.geocodesuccess = true;
                data.lat = $scope.geoCodeResponse.results[0].geometry.location.lat;
                data.lng = $scope.geoCodeResponse.results[0].geometry.location.lng;

                console.log("Geocoding result: " + data.lat + "," + data.lng);
                $scope.GetNearby(data, type);
            },
            function myError(response) {
                $scope.geoCodeResponse = response.statusText;
            }
        );
    };
    $scope.GetNearby = function(data, type) {
        $scope.spinner = true;
        if (!data.distance) {
            //alert("Invalid Distance");
            swal("Need Radius", "Please select distance", "warning");
            return;
        }
        if (!type) {
            //alert("Invalid Type");
            swal("Need Type", "Please select item type", "warning");
            return;
        }
        var getURL =
            BASEURL + "/vicinityquery?radius=" +
            data.distance * 1000 + "&latitude=" + data.lat + "&longitude=" + data.lng + "&type=" + type;

        getURL = encodeURI(getURL);
        console.log("Vicinity Query: " + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        swal("Error", "A problem occured!", "error");
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        swal("Error", "A problem occured!", "error");
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.citydonations = response.data;
                $scope.cityneeds = response.data;
                //    if (angular.isObject($scope.citydonations))
                //       $scope.found = $scope.citydonations.length + " found";
                //show last 2 days only
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filteredNeeds = [];
                if ($scope.cityneeds && $scope.cityneeds.length > 0) {
                    for (var i = 0; i < $scope.cityneeds.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.cityneeds[i].modified);
                        if (((d - o) > 7 * ONE_DAY))
                            continue;
                        else if (type != 'emergency' && $scope.cityneeds[i].email === $scope.login_email)
                            continue;
                        else
                            filteredNeeds.push($scope.cityneeds[i]);
                    }
                    console.log("Filtered " + ($scope.cityneeds.length - filteredNeeds.length) + " old records");
                    $scope.cityneeds = filteredNeeds;
                    $scope.citydonations = filteredNeeds;
                    $scope.found = $scope.cityneeds.length + " found";
                    if ($scope.cityneeds.length > 0) {
                        $scope.cancel = false;
                        $scope.allneeds = true;
                        $scope.alldonations = true;
                        return;
                    }

                } else {
                    $scope.cityneeds = [];
                    $scope.citydonations = [];
                    $scope.found = "None found";
                    $scope.allneeds = false;
                    $scope.alldonations = false;
                }

            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                //      $scope.result = "Could not submit acceptance. " + error;
                $scope.allneeds = false;
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

    $scope.Subscribe = function(data, user) {
        $scope.spinner = true;
        if (!data || !data.city || !data.itemtype) {
            //alert("Please enter City and Item name for alerts");
            swal("Need Info", "Please enter City and Item name for alerts", "info");
            return;
        }
        console.log("Creating subscription for city " + data.city + "and item type " + data.itemtype);
        $scope.result = "Sending Request....";
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/creategroup?group=";
        var group = "";

        group =
            "EVENT-" +
            data.city
            .toString()
            .trim()
            .toUpperCase() +
            "-" +
            data.itemtype
            .toString()
            .trim()
            .toUpperCase();

        getURL = encodeURI(getURL + group);
        console.log("Creating Group: " + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
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
            BASEURL + "/addusertogroup?group=" + group + "&user=" + user;
        getURL = encodeURI(getURL);
        console.log("Adding User to Group: " + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                console.log("SUCCESS ADDING SUBSCRIPTION TO GROUP " + group);
                $scope.result = "SUCCESS ADDING SUBSCRIPTION. YOU WILL NOW RECEIVE NOTIFICTAIONS FOR OFFERS OR NEEDS MATCHING THIS CRITERIA ";
                $rootScope.$emit("CallGetGroupsForUserMethod", {});
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
        var getURL = BASEURL + "/getusersingroup?group=" + group;
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
    $scope.GetEventsForUser = function(executeInBg) {

        if (!executeInBg) {
            $scope.spinner = true;
            $scope.showevents = false;
        } else {
            $scope.spinner = false;
        }
        var uuid = UserService.getLoggedIn().uuid;
        var getURL = BASEURL + "/geteventsforuser?uuid=" + uuid;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!executeInBg) {
                    $scope.spinner = false;
                    $scope.showevents = true;
                }
                //               console.log("GetEventsForUser Response= " + JSON.stringify(response));
                if (response && response.data && response.data === "No Groups Found") {
                    console.log("No Groups Found");
                    $scope.events = [];
                    //$scope.eventsCount = 0;
                    return;
                }
                console.log("Events Count= " + response.data.length);
                $scope.events = response.data;

                //Show only newer events
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filteredEvents = [];
                if ($scope.events && $scope.events.length > 0) {
                    for (var i = 0; i < $scope.events.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.events[i].modified);
                        if ((d - o) > 4 * ONE_DAY) //events for only last 4 days
                            continue;
                        else if ($scope.events[i].email === UserService.getLoggedIn().email) //self posted event
                            continue;
                        else
                            filteredEvents.push($scope.events[i]);
                    }
                    console.log("Filtered " + ($scope.events.length - filteredEvents.length) + " old records");
                    $scope.events = filteredEvents;
                    $scope.resultEvents = "Found " + $scope.events.length + " events matching your criteria.";
                }
                $scope.eventsCount = $scope.events.length;
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

    $scope.GetEventsForGroup = function(uuid) {
        if (!uuid) {
            console.log("Invalid UUID");
            return;
        }
        console.log("Inside GetEventsForGroup");
        var getURL = BASEURL + "/getconnectionsforgroup?uuid=" + uuid;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.entities)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        swal("Error", "A problem occured!", "error");
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        swal("Error", "A problem occured!", "error");
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.showevents = true;
                var aevent = {};
                if (response.data.entities && response.data.entities.length > 0) {
                    for (var i = 0; i < response.data.entities.length; i++) {
                        aevent = response.data.entities[i];
                        if ($scope.login_email === aevent.email)
                            continue;
                        else {
                            $scope.events.push(aevent);
                            $scope.eventsCount++;
                        }
                    }
                }

                // $scope.found  = "Active donation offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Error getting events for group: " + uuid);
            }
        );
    };
    $scope.GetGroupsForUser = function() {
        $scope.spinner = true;
        $scope.showmyevents = false;
        //first create group with id=<city>-<place>
        var uuid = UserService.getLoggedIn().uuid;

        var getURL = BASEURL + "/getgroupsforuser?uuid=" + uuid;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        swal("Error", "A problem occured!", "error");
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        swal("Error", "A problem occured!", "error");
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.showmyevents = true;
                console.log("GetGroupsForUser success");
                $scope.usergroups = response.data;
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
    $scope.DeleteGroupForUser = function(group) {
        $scope.spinner = true;
        $scope.showmyevents = false;
        //first create group with id=<city>-<place>
        var uuid = UserService.getLoggedIn().uuid;

        var getURL = BASEURL + "/deletegroupforuser?uuid=" + uuid + "&group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.showmyevents = true;
                $scope.GetGroupsForUser();
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
        var getURL = BASEURL + "/getuser?email=" + email.trim();
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
            //alert("ERROR - email NOT FOUND");
            swal("Oops!", "Email Not Found!", "error");
            $scope.found = "ERROR - Email NOT FOUND";
            return;
        }
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getuser?email=" + email.trim();
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
        var getURL = BASEURL + "/getuserbyuuid?uuid=" + uuid.trim();
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
            BASEURL + "/updateusersettings?uuid=" +
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
            BASEURL + "/acceptdonation?uuid=" +
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
                    $scope.GetDonations("city", row.city, false);
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
            BASEURL + "/getdonationacceptances?uuid=" + row.uuid;
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
            BASEURL + "/accepteddonations?email=" + email.trim();
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
        var cancelURL = BASEURL + "/canceloffer?uuid=" + row.uuid;

        $http({
            method: "GET",
            url: cancelURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                //alert("Successfully Cancelled.");
                swal("Good job!", "Sucessfully Cancelled!", "success");
                $scope.cancel = true;
                $scope.GetDonations("email", $scope.login_email, true);
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
            BASEURL + "/cancelaccepteddonation?uuid=" +
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
                //alert("Successfully Cancelled.");
                swal("Good job!", "Successfully Cancelled!", "success");
                if (responseAsMessage) {
                    $scope.GetMyAccepteddonations(login_email);
                    return;
                }
                $scope.uuid = row.uuid;
                $scope.cancel = true;
                $scope.Getdonations("city", row.city, false);
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
    $scope.Logout = function() {
        $scope.login_email = "";
        UserService.setLoggedInStatus(false);
        console.log("Logout: Set logged in status = " + UserService.getLoggedInStatus());
        return;
    };
});
app.controller("LoginCtrl", function(
    $scope,
    $rootScope,
    $http,
    $location,
    $routeParams,
    UserService,
    DataService
) {
    $scope.spinner = false;
    $scope.isCollapsed = true;
    $scope.isVisible = function() {
        return ("/login" !== $location.path() && "/signup" !== $location.path() && "/resetpw" !== $location.path());
    };

    $scope.showNav = "/login" !== $location.path();

    if (!angular.isObject($scope.login_email) || $scope.login_email.length == 0)
        $scope.showNav = false;
    else $scope.showNav = true;
    // alert($scope.showNav + "," + $scope.login_email.length);
    $scope.Login = function(login) {
        $scope.spinner = true;
        var getURL = BASEURL + "/loginuser?email=" + login.email.trim() + "&pw=" + login.password.trim();

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
                        //alert("Invalid Password");
                        swal("Oops!", "Invalid Pasword!", "error");
                        return;
                    } else {
                        var obj = response.data[0];
                        UserService.setLoggedIn(obj);
                        UserService.setLoggedInStatus(true);
                        $scope.loginResult = obj.username;
                        $scope.login_fullname = obj.fullname;
                        $scope.showNav = true;
                        $scope.login_email = obj.email;
                        $scope.login_phone = obj.phone;
                        $rootScope.username = obj.fullname;
                        var socket = io.connect(BASEURL);
                        socket.on('connect', function() {
                            console.log("#####Setting up listener for alerts");
                            socket.on('matchingevent', function(data) {
                                console.log("####received matching event: " + JSON.stringify(data));
                                if (!DataService.isValidObject(data) || !DataService.isValidObject(data._data)) {
                                    console.log("#####received matching event but no data!");
                                    return;
                                } else if (UserService.getLoggedIn().email === data._data.email) {
                                    console.log("#####received matching event created by self!");
                                    return;
                                } else {
                                    for (var i = 0; i < $scope.usergroups.length; i++) {
                                        if ($scope.usergroups[i].name === data._data.group_name) {
                                            //$scope.eventsCount++;
                                            var msg = JSON.stringify(data._data.items + ", address: " +
                                                data._data.address + ". Contact " + data._data.postedby + " @ " +
                                                data._data.phone_number + " or " + data._data.email);
                                            swal(JSON.stringify(data._data.eventtype), msg, "success");
                                            //sendLocalPush("FreeCycle Alert", msg);
                                            $rootScope.$emit("CallGetEventsMethod", {});
                                            break;
                                        }
                                    }
                                }
                            });
                        });
                        $rootScope.$emit("CallGetEventsMethod", {});
                        $rootScope.$emit("CallGetGroupsForUserMethod", {});
                        $location.path("/home");
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

    function sendLocalPush(title, text) {
        /*cordova.plugins.notification.local.schedule({
            title: 'My first notification',
            text: 'Thats pretty easy...',
            foreground: true
        });*/
    }
    $scope.Logout = function() {
        $scope.login_email = "";
        UserService.setLoggedInStatus(false);
        console.log("Logout: Set logged in status = " + UserService.getLoggedInStatus());
        return;
    };
    $scope.OpenRegsiterForm = function() {
        $location.path("/register");
    };
});
app.controller("RegisterCtrl", function($scope, $http, $location, UserService) {
    $scope.spinner = false;
    $scope.login_fullname = UserService.getLoggedIn().fullname;
    $scope.login_email = UserService.getLoggedIn().email;
    $scope.login_phone = UserService.getLoggedIn().phone;
    $scope.login_address = UserService.getLoggedIn().address;
    $scope.CreateUser = function(user) {
        $scope.spinner = true;
        var getURL =
            BASEURL + "/createuser?email=" +
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
                    //alert("Account Created with id " + user.email);
                    swal("Good job!", "Account Created with id " + user.email, "success");
                    $location.path("/login");
                    return;
                } else {
                    $scope.result = "Error creating id. Email already in use.";
                    //alert("Could not create user id");
                    swal("Problem!", "Could not create user id, might be existing!", "error");

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
    $scope.UpdateUser = function(user) {
        if (!user || !user.email) {
            //alert("Please Enter Valid Email");
            swal("Email Not Correct!", "Please Enter Valid Email!", "warning");
            return;
        }

        $scope.spinner = true;
        var getURL =
            BASEURL + "/updateuser?name=" + user.email.trim();
        if (user.phone)
            getURL += "&phone=" + user.phone.trim();
        if (user.address)
            getURL += "&address=" +
            user.address.trim();
        if (user.password)
            getURL += "&password=" + user.password.trim();
        getURL = encodeURI(getURL);
        console.log("Update URL=" + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (
                    angular.isObject(response)
                ) {
                    console.log("UpdateUSer response: " + JSON.stringify(response));

                    if (!$scope.login_email) {
                        //alert("Password Update Successful");
                        swal("Good job!", "Password Update Successful!", "success");
                        $scope.result = "Account Update Sucessful.";
                        $location.path("/login");
                        return;
                    } else {
                        //alert("Account Update Successful");
                        swal("Good job!", "Account Update Successful!", "success");
                        $scope.result = "Account Update Sucessful.";
                        return;
                    }
                } else {
                    $scope.result = "Could not update profile";
                    //alert("Could not update profile");
                    swal("Oops!", "Could not update profile!", "error");
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
    }
    $scope.SendResetPasswordRequest = function(email) {
        if (!email || email.length < 4) {
            //alert("Invalid Email");
            swal("Invalid Email!", "Please enter valid email!", "info");
            return;
        }
        var getURL =
            BASEURL + "/sendresetpwmail?email=" +
            email.trim();
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
                $scope.result = "An email has been sent with the password reset link.";
                console.log("SendResetPasswordRequest response: " + JSON.stringify(response));
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.loginResult = "Could not submit request.." + error;
            }
        );
    }
});