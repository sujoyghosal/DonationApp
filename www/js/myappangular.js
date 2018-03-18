var app = angular.module("myApp", [
    "ngRoute",
    "ui.bootstrap",
    "ui.directives",
    "ui.filters",
    "ui-notification",
    "720kb.socialshare"
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
                templateUrl: "home.html",
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
            .when("/index", {
                templateUrl: "index.html",
                controller: "DonationCtrl"
            })
            .when("/contactus", {
                templateUrl: "ContactUs.html",
                controller: "DonationCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });
    }
]);
app.config(['socialshareConfProvider', function configApp(socialshareConfProvider) {

    socialshareConfProvider.configure([{
            'provider': 'twitter',
            'conf': {
                'url': 'http://720kb.net',
                'text': '720kb is enough',
                'via': 'npm',
                'hashtags': 'angularjs,socialshare,angular-socialshare',
                'trigger': 'click',
                'popupHeight': 800,
                'popupWidth': 400
            }
        },
        {
            'provider': 'facebook',
            'conf': {
                'url': 'http://720kb.net',
                'popupHeight': 1000,
                'popupWidth': 1000
            }
        },
        //and so on ...
        {
            'provider': 'google',
            'conf': {
                'url': 'http://720kb.net',
                'trigger': 'mouseover',
                'popupHeight': 900,
                'popupWidth': 700
            }
        },
        {
            'provider': 'linkedin',
            'conf': {
                'url': 'http://720kb.net',
                'trigger': 'mouseover',
                'popupHeight': 900,
                'popupWidth': 700
            }
        }
    ]);
}]);
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

var BASEURL_BLUEMIX = "https://freecycleapissujoy.mybluemix.net";
var BASEURL_LOCAL = "http://localhost:9000";
var BASEURL_PIVOTAL = "http://freecycleapissujoy-horned-erasure.cfapps.io";
var BASEURL_PERSONAL = "https://freecycleapi.mybluemix.net";

var BASEURL = BASEURL_PERSONAL;

var GEOCODEURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA_sdHo_cdsKULJF-upFVP26L7zs58_Zfg";

app.controller("DonationCtrl", function($scope, $rootScope, $http, $filter, $location, $timeout, $window, Notification, Socialshare, UserService, DataService) {
    $scope.spinner = false;
    $scope.alldonations = false;
    $scope.allneeds = false;
    var socket = null;
    var room = null;

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
    //$scope.login_phone = UserService.getLoggedIn().phone;
    $scope.found = "";
    $scope.result = "";
    $scope.groupusers = [];
    var param_name = "";
    $scope.offererUUID = "";
    $scope.reverseSort = false;
    $scope.emergency = false;
    $scope.eventsCount = 0;
    $rootScope.mobileDevice = false;
    $scope.events = [];
    var today = new Date().toISOString().slice(0, 10);
    $rootScope.lastUUID = "";
    $scope.today = {
        value: today
    };
    $scope.maxDate = {
        value: new Date(2015, 12, 31, 14, 57)
    };
    $scope.isMobileDevice = function() {

    };
    $scope.isVisible = function() {
        /*return ("/login" !== $location.path() && "/signup" !== $location.path() &&
            "/resetpw" !== $location.path() && "/updatepassword" !== $location.path());*/
        return true;
    };
    $rootScope.$on("CallGetEventsMethod", function() {
        $scope.GetEventsForUser(true);
    });
    $rootScope.$on("CallGetGroupsForUserMethod", function() {
        $scope.GetGroupsForUser();
    });
    $rootScope.$on('$routeChangeStart', function(event, next) {

        if (!UserService.getLoggedInStatus() && ("/offerdonation" === $location.path() ||
                "/subscribe" === $location.path() || "/notifications" === $location.path() ||
                "/updatepassword" === $location.path() || "/createneed" === $location.path() ||
                "/createemergency" === $location.path() || "/offershistory" === $location.path())) {
            //console.log("User not logged in for access to " + $location.path());
            /* You can save the user's location to take him back to the same page after he has logged-in */
            $rootScope.savedLocation = $location.path();

            $location.path("/login");
            return;
        } else if (UserService.getLoggedInStatus() && "/login" == $location.path()) {
            $location.path("/home");
            return;
        }

    });

    $scope.GeoCodeAddress = function(offer, func) {
        console.log("GeoCode URL=" + GEOCODEURL + "&address=" +
            offer.address);

        $http({
            method: "GET",
            url: encodeURI(GEOCODEURL + "&address=" + offer.address)
        }).then(
            function mySucces(response) {
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.results)) {
                    console.log("####Invalid response")
                    Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
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
                    Notification.error({ message: "A problem occured getting address latitude/longitude!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                }
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
    $scope.english = '';
    $scope.GetFontAwesomeIconsForCategory = function(category) {
        var icon = '';
        if (!category || category.length < 4)
            return "fa fa-star";
        switch (category.trim()) {
            case "Electronics":
                icon = "fa fa-mobile";
                break;
            case "Fashion":
                icon = "fa fa-female";
                break;
            case "Educational":
                icon = "fa fa-university";
                break;
            case "Blood":
                icon = "fa fa-tint";
                break;
            case "Medical":
                icon = "fa fa-stethoscope";
                break;
            case "Organs":
                icon = "fa fa-heartbeat";
                break;
            case "Life Saving Drugs":
                icon = "fa fa-hospital-o";
                break;
            case "General Medicines":
                icon = "fa fa-medkit";
                break;
            case "Ambulance":
                icon = "fa fa-ambulance";
                break;
            case "Doctor":
                icon = "fa fa-user-md";
                break;
            case "Food":
                icon = "fa fa-cutlery";
                break;
            case "Furniture":
                icon = "fa fa-bed";
                break;
            case "Clothes":
                icon = "fa fa-shirtsinbulk";
                break;
            case "Sports":
                icon = "fa fa-futbol-o";
                break;
            case "Household":
                icon = "fa fa-home";
                break;
            case "Shoes":
                icon = "fa fa-tags";
                break;
            case "Other":
                icon = "fa fa-star";
            case "Natural Disaster":
                icon = "fa fa-fire";
                break;
            case "Terrorism":
                icon = "fa fa-bomb";
                break;
            case "Accident":
                icon = "fa fa-ambulance";
                break;
            case "Women's Safety":
                icon = "fa fa-life-ring";
                break;
            case "Children's Safety":
                icon = "fa fa-child";
                break;
            default:
                icon = "fa fa-star";
        }
        console.log("GetFontAwesomeIconsForCategory: Category=" + category + ", Icon=>" + icon);
        return icon;
    };
    $scope.TranslateEventToEnglish = function(type) {
        if (!type)
            $scope.english = "Emergency Event";
        switch (type.toUpperCase().trim()) {
            case "BLOOD":
                $scope.english = "Blood Needed";
                $scope.emergency = true;
                break;
            case "BLOOD":
                $scope.english = "Blood Needed";
                $scope.emergency = true;
                break;
            case "ORGANS":
                $scope.english = "Organ Needed";
                $scope.emergency = true;
                break;
            case "LIFE SAVING DRUGS":
                $scope.english = "Life Saving Drugs Needed";
                $scope.emergency = true;
                break;
            case "GENERAL MEDICINES":
                $scope.english = "General Medicines Needed";
                $scope.emergency = true;
                break;
            case "DOCTOR":
                $scope.english = "Doctor Needed";
                $scope.emergency = true;
                break;
            case "AMBULANCE":
                $scope.english = "Ambulance Needed";
                $scope.emergency = true;
                break;
            case "MEDICAL":
                $scope.english = "Medical Needs";
                $scope.emergency = true;
                break;
            case "DISASTER":
                $scope.english = "Natural Disaster";
                $scope.emergency = true;
                break;
            case "TERRORISM":
                $scope.english = "Terror Attack";
                $scope.emergency = true;
                break;
            case "ACCIDENT":
                $scope.english = "Accident";
                $scope.emergency = true;
                break;
            case "SAFETY":
                $scope.english = "Incident";
                $scope.emergency = true;
                break;
            case "OTHER":
                $scope.english = "Other Emergency";
                $scope.emergency = true;
                break;
            default:
                $scope.english = type;
        }
        return $scope.english;
    }
    $scope.isEmergency = function(type) {
        $scope.emergency = false;
        $scope.TranslateEventToEnglish(type);
        return $scope.emergency;
    }
    $scope.StackIcon = function(icon) {
        console.log("####StackIcon = " + icon + ' fa-stack-1x');
        $scope.stackicon = icon + ' fa-stack-1x';
        return icon + ' fa-stack-1x';
    }
    $scope.SendOffer = function(offer) {
        $scope.loginResult = "";
        var now = new Date();
        $scope.loginResult = "Sent Request";
        var postURL = BASEURL + "/createdonations";
        var reqObj = {
            email: $scope.login_email,
            offeredby: $scope.login_fullname,
            time: now,
            phone_number: event.phone,
            address: offer.address,
            city: offer.city,
            items: offer.items,
            itemtype: offer.itemtype,
            location: {
                latitude: $scope.lat,
                longitude: $scope.lng
            },
            fa_icon: $scope.GetFontAwesomeIconsForCategory(offer.itemtype)
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj)).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("Create Donation Response:" + JSON.stringify(response));
                $scope.loginResult = "Success";
                Notification.success({ message: "Good job! Successufully Published Your Offer. Thank You!", positionY: 'bottom', positionX: 'center' });
                //Notification.success({message: 'Success Top Left', positionX: 'left'});
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
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
            url: encodeURI(sendURL)
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                if (response && response.data && response.data.entities && response.data.entities.length > 0) {
                    $scope.loginResult = "Success";
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
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };
    $scope.setupWebSockets = function(purpose, arg) {
        console.log("#####Setting up listener for alerts");
        socket = io.connect(BASEURL);
        socket.on('connect', function() {
            console.log("##### Connected to server socket!");
            for (var i = 0; i < $scope.usergroups.length; i++) {
                //socket.join($scope.usergroups[i].name);
                room = $scope.usergroups[i].name;
                console.log("#### Joining events channel " + room);
                socket.emit('room', room);
                console.log("Test message");
            }
        });
        if (purpose && purpose === "init") {
            for (var i = 0; i < $scope.usergroups.length; i++) {
                //socket.join($scope.usergroups[i].name);
                room = $scope.usergroups[i].name;
                console.log("#### Joining events channel " + room);
                socket.emit('room', room);
            }
        } else if (purpose && purpose === "leave") {
            if (arg && arg.length > 0) {
                console.log("#### Leaving room " + arg);
                socket.emit('leave', arg);
            }
        }
        socket.on('matchingevent', function(data) {
            console.log("####received matching event: " + JSON.stringify(data));
            if (!DataService.isValidObject(data) || !DataService.isValidArray(data.entities)) {
                console.log("#####received matching event but no data!");
                return;
            } else if (UserService.getLoggedIn().email === data.entities[0].email) {
                console.log("#####received matching event created by self!");
                return;
            } else {
                console.log("#####lastUUID for HandleEvent=" + $rootScope.lastUUID + " and entity uuid=" + data.entities[0].uuid);
                if ($rootScope.lastUUID === data.entities[0].uuid) {
                    console.log("#####Discarding duplicate events");
                } else {
                    $rootScope.lastUUID = data.entities[0].uuid;
                    for (var i = 0; i < $scope.usergroups.length; i++) {
                        if ($scope.usergroups[i].name === data.entities[0].group_name) {
                            var msg = JSON.stringify(data.entities[0].items + "@: " +
                                data.entities[0].address + ". Contact " + data.entities[0].postedby + ": " +
                                data.entities[0].phone_number + " / " + data.entities[0].email);
                            console.log("#####received matching event created by others! " + msg);
                            $scope.HandleEvent("FreeCycle Alert", msg);
                            break;
                        }

                    }
                }
            }
        });
        socket.onclose = function(evt) {
            console.log("##### Received socket onlcose event: " + JSON.stringify(evt));
            $scope.setupWebSockets('init', null);
        };
    }
    $scope.HandleEvent = function(title, text) {
        /*cordova.plugins.notification.local.schedule({
            title: title,
            text: text,
            foreground: true
        });*/
        console.log("####Handling matching event..." + text);
        if (!text || text.length < 2) {
            console.log("No substantial text for notification..aborting");
            return;
        }
        Notification.info({
            message: text.replace(/\"$/, "").replace(/\"/, ""),
            title: title,
            positionY: 'top',
            positionX: 'center',
            delay: 4000,
            replaceMessage: true
        });
        console.log("#####Calling GetEvents");
        $rootScope.$emit("CallGetEventsMethod", {});
    }
    $scope.CreateNeed = function(need, emergency) {
        $scope.loginResult = "";
        var now = new Date();
        $scope.loginResult = "Request Sent";
        var postURL = BASEURL + "/createneed";
        var reqObj = {
            email: $scope.login_email,
            postedby: $scope.login_fullname,
            time: now,
            phone_number: need.phone,
            address: need.address,
            city: need.city,
            items: need.items,
            itemtype: need.itemtype,
            location: {
                latitude: $scope.lat,
                longitude: $scope.lng
            },
            fa_icon: $scope.GetFontAwesomeIconsForCategory(need.itemtype),
            emergency: emergency
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj)).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                Notification.success({ message: "Successufully Published. Thank You!", title: "Good job!", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = "A problem occurred processing the request. Please try again later.";
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

        var notifyURL =
            BASEURL + "/sendpush/devicespush?regids=" +
            gcmids +
            "&text=" +
            text;
        console.log("SendPush: notifyURL=" + notifyURL);
        $http({
            method: "GET",
            url: encodeURI(notifyURL)
        }).then(
            function successCallback(response) {
                $scope.spinner = false;

                //   $scope.result = "Successfully Sent Push Messages to Subscribed Users for these locations.";
            },
            function errorCallback(error) {
                $scope.spinner = false;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                //          $scope.result = "Could not send push messages. ";
            }
        );
    };
    $scope.CreateEvent = function(event, group_uuid, group_name) {
        $scope.loginResult = "";
        var now = new Date();
        var postURL = BASEURL + "/createevent";
        var reqObj = {
            email: $scope.login_email,
            postedby: $scope.login_fullname,
            time: now,
            phone_number: event.phone,
            address: event.address,
            city: event.city,
            items: event.items,
            itemtype: event.itemtype,
            latitude: $scope.lat,
            longitude: $scope.lng,
            fa_icon: $scope.GetFontAwesomeIconsForCategory(event.itemtype),
            group_uuid: group_uuid,
            group_name: group_name
        };
        postURL = encodeURI(postURL);
        console.log("#######CreateEvent URL=" + postURL);
        $http.post(postURL, JSON.stringify(reqObj))
            .then(
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
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
    $scope.SocialShare = function(row, site) {

        if (!DataService.isValidObject(row))
            return;
        var message = row.items;
        var title = '';
        if (!DataService.isUnDefined(row.postedby)) {
            message += ' posted by ' + row.postedby;
            title = "FreeCycle Alert: " + row.itemtype;
        } else if (!DataService.isUnDefined(row.offeredby)) {
            message += ' offered by ' + row.offeredby;
            title = "FreeCycle Alert: " + row.itemtype + " Item Offered";
        }
        message += ' at ' + row.address + '; posted on ' + new Date(row.modified);
        var options = {};
        switch (site) {
            case 'twitter':
                options = {
                    provider: "twitter",
                    attrs: {
                        socialshareText: message
                    }
                }
                break;
            case 'facebook':
                options = {
                    provider: "facebook",
                    attrs: {
                        socialshareQuote: message
                            //socialshareVia: "1942374775794853"
                    }
                }
                break;
            case 'google':
                options = {
                    provider: "google",
                    attrs: {
                        socialshareUrl: 'http://720kb.net'

                    }
                }
                break;
            case 'linkedin':
                options = {
                    provider: "linkedin",
                    attrs: {
                        socialshareText: title,
                        socialshareDescription: message
                    }
                }
                break;
            case 'flipboard':
                options = {
                    provider: "flipboard",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'pocket':
                options = {
                    provider: "pocket",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'tumblr':
                options = {
                    provider: "tumblr",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'pinterest':
                options = {
                    provider: "pinterest",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'stumbleupon':
                options = {
                    provider: "stumbleupon",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'digg':
                options = {
                    provider: "digg",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
        }
        Socialshare.share(options);
    }
    $scope.GetDonations = function(paramname, paramvalue, myoffers) {
        if (!paramvalue || paramvalue.length < 2) {
            alert("Need " + paramname, "Please provide a valid " + paramname, "warning");
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
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                    //console.log("Filtered " + ($scope.citydonations.length - filteredDonations.length) + " old records");
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
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.alldonations = false;
            }
        );
    };
    $scope.GetNeeds = function(paramname, paramvalue, emergency) {
        if (!paramvalue || paramvalue.length < 2) {
            alert("Need " + paramname, "Please provide a valid " + paramname, "warning");
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
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                    //console.log("Filtered " + ($scope.cityneeds.length - filteredNeeds.length) + " old records");
                    $scope.cityneeds = filteredNeeds;
                    $scope.found = $scope.cityneeds.length + " found";
                    if ($scope.cityneeds.length == 0) {
                        $scope.allneeds = false;
                        return;
                    } else {
                        $scope.allneeds = true;
                        $scope.cancel = false;
                    }
                } else {
                    $scope.cityneeds = [];
                    $scope.found = "None found";
                    $scope.spinner = false;
                    $scope.alldonations = false;
                    $scope.allneeds = false;
                    return;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                //      $scope.result = "Could not submit acceptance. " + error;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
            Notification.error({ message: "Please provide a valid address", positionY: 'bottom', positionX: 'center' });
            return;
        }
        if (!data.distance) {
            Notification.error({ message: "Please select distance", positionY: 'bottom', positionX: 'center' });
            return;
        }
        $http({
            method: "GET",
            url: encodeURI(GEOCODEURL + "&address=" + data.searchAddress)
        }).then(
            function mySucces(response) {
                console.log("URL=" + GEOCODEURL + "&address=" + data.searchAddress);
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.results)) {
                    console.log("####Invalid response")
                    Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
            Notification.error({ message: "Please select distance", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
            return;
        }
        if (!type) {
            //alert("Invalid Type");
            Notification.error({ message: "Please select Item Type", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                    //console.log("Filtered " + ($scope.cityneeds.length - filteredNeeds.length) + " old records");
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
                    $scope.spinner = false;
                }

            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
            Notification.error({ message: "Please enter City and Item name for alerts", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
            return;
        }
        console.log("Creating subscription for city " + data.city + "and item type " + data.itemtype);
        $scope.result = "Sending Request....";
        var group = "EVENT-" +
            data.city
            .toString()
            .trim()
            .toUpperCase() +
            "-" +
            data.itemtype
            .toString()
            .trim()
            .toUpperCase();
        var postURL = BASEURL + "/creategroup";
        var reqObj = {
            group: group
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj))
            .then(
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
                    $scope.found = "Could not process this request. Please try again later!";
                    console.log("#####Subscribe error: " + JSON.stringify(error));
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
                Notification.success({ message: "SUCCESS ADDING SUBSCRIPTION. YOU WILL NOW RECEIVE NOTIFICTAIONS FOR OFFERS OR NEEDS MATCHING THIS CRITERIA.", title: "Success!", positionY: 'bottom', positionX: 'center', delay: 4000 });
                $rootScope.$emit("CallGetGroupsForUserMethod", {});
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "ERROR ADDING SUBSCRIPTION TO THIS EVENT";
                Notification.error({ message: "ERROR ADDING SUBSCRIPTION TO THIS EVENT.", title: "Error!", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                    $scope.eventsCount = 0;
                    $scope.found = "You are not subscribed for notifications. Please select an event first from subscription menu.";
                    $scope.showevents = false;
                    return;
                }
                //console.log("Events Count= " + response.data.length);
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
                    //console.log("Filtered " + ($scope.events.length - filteredEvents.length) + " old records");
                    $scope.events = filteredEvents;
                    $scope.resultEvents = "Found " + $scope.events.length + " events matching your criteria.";
                } else {
                    $scope.found = "No Notifications Found";
                    $scope.showevents = false;
                }
                $scope.eventsCount = $scope.events.length;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.showevents = false;
                $scope.found = "Problem fetching notifications. Please try again later.";
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
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
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
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.showmyevents = true;
                console.log("GetGroupsForUser success");
                $scope.usergroups = response.data;
                $rootScope.$emit("CallGetEventsMethod", {});
                $scope.setupWebSockets("init", null);
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
        if (!group || group.length < 2) {
            console.log("####Invalid Group Name Received in DeleteGroupForUser");
            return;
        }
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
                Notification.success({ message: "Successfully removed this subscription!", positionY: 'bottom', positionX: 'center' });
                $scope.result = "Successfully removed this subscription!";
                $scope.setupWebSockets("leave", group);
                $rootScope.$emit("CallGetGroupsForUserMethod", {});
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
            Notification.error({ message: "Email Not Found!", positionY: 'bottom', positionX: 'center' });
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
            url: encodeURI(updateURL)
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
        if (confirm("Are you sure you want to cancel this offer?") == false) {
            console.log("####User cancelled Offer Deletion");
            return;
        }
        $scope.spinner = true;
        var cancelURL = BASEURL + "/canceloffer?uuid=" + row.uuid;
        Notification.info({ message: "Obliterating offer..please wait!", positionY: 'bottom', positionX: 'center' });
        $http({
            method: "GET",
            url: encodeURI(cancelURL)
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                //alert("Successfully Cancelled.");
                Notification.success({ message: "All done! Sucessfully removed offer.", positionY: 'bottom', positionX: 'center' });
                $scope.cancel = true;
                $scope.GetDonations("email", $scope.login_email, true);
                $scope.result = "Successfully Cancelled This Offer";
                /*SendPushToUser(
                    row.receiver.receiver_uuid,
                    "A donation offered by " + $scope.fullname + " has been cancelled"
                );*/
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "Could not cancel. " + cancelURL;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
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
                Notification.info({ message: "Successfully Cancelled This Offer!", positionY: 'bottom', positionX: 'center' });
                if (responseAsMessage) {
                    $scope.GetMyAccepteddonations(login_email);
                    return;
                }
                $scope.uuid = row.uuid;
                $scope.cancel = true;
                $scope.Getdonations("city", row.city, false);
                $scope.result = "Cancelled donation";
                //    SendPushToUserByEmail(row.email, "donation cancelled by a passenger");
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "Could not cancel. ";
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.accepted = false;
                $scope.uuid = row.uuid;
                $scope.cancel = false;
            }
        );
    };
    $scope.ContactUs = function(query) {
        $scope.spinner = true;
        var getURL =
            /*BASEURL + "/contactus?email=" +
            query.email.trim() +
            "&fullname=" +
            query.name.trim() +
            "&phone=" +
            query.phone.trim() + "&city=" +
            query.city.trim() + "&subject=" +
            query.subject.trim() + "&text=" +
            query.text.trim();*/
            BASEURL + "/contactus";
        getURL = encodeURI(getURL);
        var reqObj = {
            email: query.email.trim(),
            fullname: query.name.trim(),
            phone: query.phone.trim(),
            city: query.city.trim(),
            subject: query.subject.trim(),
            text: query.text.trim()
        };
        console.log("ContactUs URL=" + getURL);
        $http.post(getURL, JSON.stringify(reqObj))
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.spinner = false;
                    if (
                        angular.isObject(response) &&
                        response.data.toString() === "QUERY CREATED"
                    ) {
                        Notification.success({ message: "Thank You! Your query has been sent. We will get back to you as soon as possible.", positionY: 'bottom', positionX: 'center' });
                        $scope.result = "Thank You! Your query has been sent. We will get back to you as soon as possible.";
                        return;
                    } else {
                        $scope.result = "Error sending mail. Please try again later.";
                        Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                        return;
                    }
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.spinner = false;
                    $scope.result = "Error submitting  request. Please try again later.";
                    Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                }
            );
    };
    $scope.Logout = function() {
        $scope.login_email = "";
        UserService.setLoggedIn({});
        UserService.setLoggedInStatus(false);
        $rootScope.loggedIn = false;
        $scope.eventsCount = 0;
        $location.path("/home");
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
    Notification,
    UserService,
    DataService
) {
    $scope.spinner = false;
    $scope.isCollapsed = true;
    $rootScope.mobileDevice = false;
    $rootScope.$on("CallSetupWebSocketsMethod", function() {
        $scope.setupWebSockets("init", null);
    });
    $scope.isVisible = function() {
        //return ("/login" !== $location.path() && "/signup" !== $location.path() && "/resetpw" !== $location.path());
        return true;
    };

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
                        confirm(
                            "Email ID not found in App database. Would you like to create an account with this id?"
                        ) == true
                    ) {
                        $location.path("/signup");
                        return;
                    }
                } else {
                    //        alert("Id Found");
                    if (angular.isObject(response) &&
                        response.data.toString() === "Authentication Error") {
                        Notification.error({ message: "Invalid Password!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        var obj = response.data[0];
                        UserService.setLoggedIn(obj);
                        UserService.setLoggedInStatus(true);
                        $scope.loginResult = obj.username;
                        $scope.login_fullname = obj.fullname;
                        $scope.login_email = obj.email;
                        $scope.login_phone = obj.phone;
                        $rootScope.username = obj.fullname;
                        $rootScope.loggedIn = true;
                        $rootScope.$emit("CallGetGroupsForUserMethod", {});
                        $location.path($rootScope.savedLocation);
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
        UserService.setLoggedIn({});
        UserService.setLoggedInStatus(false);
        $rootScope.loggedIn = false;
        $scope.eventsCount = 0;
        $location.path("/home");
        console.log("Logout: Set logged in status = " + UserService.getLoggedInStatus());
        return;
    };
});
app.controller("RegisterCtrl", function($scope, $http, $location, $window, UserService, DataService, Notification) {
    $scope.spinner = false;
    $scope.login_fullname = UserService.getLoggedIn().fullname;
    $scope.login_email = UserService.getLoggedIn().email;
    //    $scope.login_phone = UserService.getLoggedIn().phone;
    //    $scope.login_address = UserService.getLoggedIn().address;
    $scope.CreateUser = function(user) {
        $scope.spinner = true;
        var getURL = BASEURL + "/createuser";
        var reqObj = {
            email: user.email.trim(),
            fullname: user.fullname.trim(),
            password: user.password.trim(),
            organisation: user.org,
            ngo: user.ngo
        };
        getURL = encodeURI(getURL);
        console.log("ContactUs URL=" + getURL);
        $http.post(getURL, JSON.stringify(reqObj))
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.spinner = false;
                    if (
                        angular.isObject(response) &&
                        response.data.toString() === "CREATED"
                    ) {
                        Notification.success({ message: "Account Created with id " + user.email, positionY: 'bottom', positionX: 'center' });
                        $location.path("/login");
                        return;
                    } else {
                        $scope.result = "Error creating id. Email already in use.";
                        Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                        //        $location.path("/login");
                        return;
                    }
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.spinner = false;
                    $scope.loginResult = "Could not submit request.." + error;
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                }
            );
    };
    $scope.UpdateUser = function(user) {

        if ($scope.login_email && (!user || (!user.phone && !user.address))) {
            Notification.error({ message: "Please enter values to update", positionY: 'bottom', positionX: 'center' });
            $scope.spinner = false;
            return;
        } else if (!$scope.login_email && (!user || !user.email || !user.password)) {
            Notification.error({ message: "Please Enter Email and Password", positionY: 'bottom', positionX: 'center' });
            return;
        }
        $scope.spinner = true;
        var email = '';
        if ($scope.login_email)
            email = $scope.login_email;
        else
            email = user.email;
        var getURL =
            BASEURL + "/updateuser?name=" + email;
        /*if (user && user.phone)
            getURL += "&phone=" + user.phone.trim();
        else
            getURL += "&phone=" + UserService.getLoggedIn().phone;
        if (user && user.address)
            getURL += "&address=" + user.address.trim();
        else
            getURL += "&address=" + UserService.getLoggedIn().address;*/
        if (user && user.password)
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
                        Notification.success({ message: "Password Update Successful!", positionY: 'top', positionX: 'center', delay: 4000 });
                        $scope.result = "Password Update Sucessful.";
                        $location.path("/login");
                        return;
                    } else {
                        Notification.success({ message: "Successfully updated your info!", positionY: 'top', positionX: 'center', delay: 4000 });
                        $scope.result = "Account Update Sucessful.";
                        if (DataService.isValidObject(response) &&
                            DataService.isValidObject(response.data) &&
                            DataService.isValidObject(response.data._data)) {
                            UserService.setLoggedIn(response.data._data);
                        }
                        return;
                    }
                } else {
                    $scope.result = "Could not update profile";
                    Notification.error({ message: "Could not update profile!", positionY: 'top', positionX: 'center', delay: 4000 });
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
            Notification.info({ message: "Please enter valid email!", positionY: 'top', positionX: 'center', delay: 4000 });
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
                console.log("SendResetPasswordRequest response: " + JSON.stringify(response));
                if (DataService.isValidObject(response) && (response.data) && response.data == "Email Not Found") {
                    Notification.error({ message: "Error processing this request. Please check the email address!", positionY: 'bottom', positionX: 'center' });
                } else {
                    Notification.success({ message: "An email has been sent with the password reset link.", positionY: 'bottom', positionX: 'center' });
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.loginResult = "Could not submit request.." + error;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
            }
        );
    }
    $scope.Back = function() {
        $window.history.back();
    }
});