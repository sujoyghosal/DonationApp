var express = require("express");
var usergrid = require("usergrid");

//var config = require('./config');
// Set up Express environment and enable it to read and write JavaScript
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
        res.send(200);
    } else {
        next();
    }
};
var app = express();
app.use(allowCrossDomain);
//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
// Initialize Usergrid

var ug = new usergrid.client({
    orgName: "sujoyghosal",
    appName: "FREECYCLE",
    URI: "https://apibaas-trial.apigee.net",
    clientId: "YXA6G1hmX-hzEea1pBIuBzeXfQ",
    clientSecret: "YXA6c7dP5Vh70lI3N1VHoQfP1lvlstQ",
    logging: true
});

var loggedIn = null;

// The API starts here

// GET /

var rootTemplate = {
    donations: { href: "./donations" }
};

app.get("/", function(req, resp) {
    //    resp.jsonp(rootTemplate);
    out = "Hey, are you looking for something?";
    out +=
        "  Use /alldonations to get all donations or createdonations with name=value pairs to create a donations";
    resp.jsonp(out);
});

// GET
var userid;
app.get("/alldonations", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, getalldonations);
    } else {
        userid = req.param("userid");
        getalldonations(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

var options = {
    type: "donations?limit=100",
    qs: { ql: "user_id='" + userid + "'" }
};
//Call request to initiate the API call

function getalldonations(req, res) {
    loggedIn.createCollection({ type: "donations?limit=100" }, function(
        err,
        donations
    ) {
        //    loggedIn.createCollection(options, function(err, ngccnotifications) {
        //  loggedIn.request({ options, function(err, ngccnotifications) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }

        var alldonations = [];
        while (donations.hasNextEntity()) {
            var adonations = donations.getNextEntity().get();
            alldonations.push(adonations);
        }
        res.jsonp(alldonations);
    });
}

var donations_query = "";
app.get("/getdonations", function(req, res) {
    var paramname = req.param("paramname");
    var paramvalue = req.param("paramvalue");
    donations_query = {
        type: "donations?limit=100", //Required - the type of collection to be retrieved
        qs: { ql: paramname + "='" + paramvalue + "'" }
    };
    if (paramname === "uuid") {
        donations_query = {
            type: "donations", //Required - the type of collection to be retrieved
            uuid: paramvalue
        };
    }
    if (loggedIn === null) {
        logIn(req, res, getdonations);
    } else {
        getdonations(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getdonations(req, res) {
    loggedIn.createCollection(donations_query, function(err, donations) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        var alldonations = [];
        while (donations.hasNextEntity()) {
            var adonations = donations.getNextEntity().get();

            alldonations.push(adonations);
        }
        res.jsonp(alldonations);
    });
}
var group_query = "";
app.get("/getusersingroup", function(req, res) {
    var group = req.param("group");

    group_query = {
        method: "GET",
        endpoint: "groups/" + group + "/users/"
    };

    if (loggedIn === null) {
        logIn(req, res, getusersingroup);
    } else {
        getusersingroup(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getusersingroup(req, res) {
    loggedIn.request(group_query, function(err, users) {
        if (err) {
            res.send("ERROR - " + JSON.stringify(err));
        } else {
            res.send(users.entities);
        }
    });
}

var gcmids_query = "";
var gcmid = "";
app.get("/attachgcmidtouser", function(req, res) {
    gcmid = req.param("gcmid");
    var uuid = req.param("uuid");

    gcmids_query = {
        type: "user",
        uuid: req.param("uuid")
    };

    if (loggedIn === null) {
        logIn(req, res, attachgcmidtouser);
    } else {
        attachgcmidtouser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function attachgcmidtouser(req, res) {
    loggedIn.getEntity(gcmids_query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var gcm_ids = [];
            if ("gcm_ids" in entity._data) gcm_ids = entity._data.gcm_ids;
            //            res.send(gcm_ids);
            //            return;
            if (gcm_ids.indexOf(gcmid) > -1) {
                res.send("SUCCESS");
                return;
            }

            gcm_ids.push(gcmid);
            entity.set("gcm_ids", gcm_ids);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send(gcm_ids);
            });
        }
    });
}

var detach_query = "";
app.get("/detachgcmidsfromuser", function(req, res) {
    detach_query = {
        type: "user",
        uuid: req.param("uuid")
    };

    if (loggedIn === null) {
        logIn(req, res, detachgcmidsfromuser);
    } else {
        detachgcmidsfromuser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function detachgcmidsfromuser(req, res) {
    loggedIn.getEntity(detach_query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var gcm_ids = [];
            entity.set("gcm_ids", gcm_ids);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send("SUCCESS " + gcm_ids);
            });
        }
    });
}
app.get("/updateusersettings", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, updateusersettings);
    } else {
        updateusersettings(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function updateusersettings(req, res) {
    var option = {
        type: "users",
        uuid: req.param("uuid")
    };
    loggedIn.getEntity(option, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var settings = {
                pushon: req.param("pushon"),
                pushstarttimehrs: req.param("starttimehrs"),
                pushstoptimehrs: req.param("stoptimehrs"),
                pushstarttimemin: req.param("starttimemin"),
                pushstoptimemin: req.param("stoptimemin")
            };
            entity.set("settings", settings);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send(entity);
            });
        }
    });
}
var uuid = "";
var updateoptions = "";
var receiver = {};
var acceptoptions = "";

app.get("/acceptdonation", function(req, res) {
    uuid = req.param("uuid");

    receiver = {
        receiver_name: req.param("receiver_name"),
        receiver_phone: req.param("receiver_phone"),
        receiver_email: req.param("receiver_email"),
        receiver_uuid: req.param("receiver_uuid"),
        received_time: req.param("received_time")
    };
    updateoptions = {
        receiver: receiver,
        status: "Accepted"
    };
    var acname = uuid + req.param("receiver_email");
    acceptoptions = {
        donationid: uuid,
        name: acname,
        receiver: receiver,
        status: "Accepted"
    }; //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
    /*    if (loggedIn === null) {
            logIn(req, res, updatecount);
          } else {
            userid = req.param('userid');
            updatecount(req, res);
          }*/
    if (
        loggedIn === null
    ) {
        logIn(req, res, function() {
            //    acceptdonation(acceptoptions,updateoptions, req, res);
            acceptdonation(uuid, req, res);
        });
    } else {
        //acceptdonation(acceptoptions,updateoptions, req, res);
        acceptdonation(uuid, req, res);
    }
});

function acceptdonation(uuid, req, res) {
    var opt = {
        type: "donations", //Required - the type of collection to be retrieved
        uuid: uuid
    };

    loggedIn.getEntity(opt, function(err, donations) {
        //    loggedIn.createCollection(options, function(err, ngccnotifications) {
        //  loggedIn.request({ options, function(err, ngccnotifications) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }

        //        res.send(donations._data.passengers.length);
        //        return;
        donations.set("receiver", receiver);
        donations.set("status", req.param("status"));

        donations.save(function(err) {
            if (err) {
                //error - user not updated
                //  res.jsonp(500, {'error': JSON.stringify(err) });
                res.send("Damn! Error Saving Object!");
                return;
            } else {
                //success - user updated
                res.jsonp(donations);
            }
        });
    });
}

var adonations_query = "";
app.get("/accepteddonations", function(req, res) {
    var email = req.param("email");

    if (loggedIn === null) {
        logIn(req, res, function() {
            accepteddonations(email, req, res);
        });
    } else {
        accepteddonations(email, req, res);
    }
});

function accepteddonations(email, req, res) {
    var opt = {
        type: "donations",
        qs: { ql: "status='ACCEPTED' && receiver.receiver_email='" + email + "'" }
    };
    loggedIn.createCollection(opt, function(err, donations) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        //        res.jsonp(donations._list[0]._data.passengers);
        //        return;
        var accepted_donations = [];
        if (!donations._list || donations._list.length === 0) {
            res.send("You Have No Accepted donations.");
            return;
        } else {
            for (var i = 0; i < donations._list.length; i++) {
                accepted_donations.push(donations._list[i]);
            }
        }
        if (accepted_donations && accepted_donations.length > 0)
            res.send(accepted_donations);
        else res.send("You Have No Accepted donations.");
    });
}
var adonations_query = "";
app.get("/getpassengersfordonation", function(req, res) {
    var uuid = req.param("uuid");

    if (loggedIn === null) {
        logIn(req, res, function() {
            getpassengersfordonation(uuid, req, res);
        });
    } else {
        getpassengersfordonation(uuid, req, res);
    }
});

function getpassengersfordonation(uuid, req, res) {
    var query = {
        type: "donations",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data.passengers);
            return;
        }
    });
}

var adonations_query = "";
app.get("/getgcmidsbyuser", function(req, res) {
    var uuid = req.param("uuid");

    if (loggedIn === null) {
        logIn(req, res, function() {
            getgcmidsbyuser(uuid, req, res);
        });
    } else {
        getgcmidsbyuser(uuid, req, res);
    }
});

function getgcmidsbyuser(uuid, req, res) {
    var query = {
        type: "user",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data.gcm_ids);
            return;
        }
    });
}

var adonations_query = "";
app.get("/getuserbyuuid", function(req, res) {
    var uuid = req.param("uuid");

    if (loggedIn === null) {
        logIn(req, res, function() {
            getuserbyuuid(uuid, req, res);
        });
    } else {
        getuserbyuuid(uuid, req, res);
    }
});

function getuserbyuuid(uuid, req, res) {
    var query = {
        type: "user",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data);
            return;
        }
    });
}

app.get("/canceloffer", function(req, res) {
    var uuid = req.param("uuid");

    if (loggedIn === null) {
        logIn(req, res, function() {
            canceloffer(uuid, req, res);
        });
    } else {
        canceloffer(uuid, req, res);
    }
});

function canceloffer(uuid, req, res) {
    var opt = {
        type: "donations",
        uuid: uuid
    };
    loggedIn.getEntity(opt, function(err, o) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        o.destroy(function(err) {
            if (err) {
                res.send("Could not cancel offer");
            } else {
                //success - user deleted from database
                o = null; //blow away the local object
                res.send("Successfully Cancelled Offered donation.");
            }
        });
    });
}

app.get("/cancelaccepteddonation", function(req, res) {
    var uuid = req.param("uuid");
    var receiver_email = req.param("receiver_email");

    updateoptions = {
        type: "donations", //Required - the type of collection to be retrieved
        uuid: uuid
    };

    if (loggedIn === null) {
        logIn(req, res, function() {
            canceldonation(receiver_email, updateoptions, req, res);
        });
    } else {
        canceldonation(receiver_email, updateoptions, req, res);
    }
});

function canceldonation(e, updateoptions, req, res) {
    loggedIn.getEntity(updateoptions, function(err, o) {
        if (err) {
            res.jsonp(500, err);
            return;
        }
        if (o._data.receiver.receiver_email === e) {
            o.set("receiver", "");
            o.set("status", "OFFERED");
        }

        o.save(function(err) {
            if (err) {
                //             res.jsonp(500, err);
                res.send("Could not update status to cancelled");
                return;
            } else {
                res.jsonp(o);
            }
        });
    });
}

app.get("/createdonations", function(req, res) {
    var b = req.body;
    var name = req.param("email") + "-" + req.param("time");
    var e = {
        name: name,
        offeredby: req.param("offeredby"),
        from_place: req.param("from_place"),
        city: req.param("city"),
        address: req.param("address"),
        phone_number: req.param("phone_number"),
        email: req.param("email"),
        currentcount: "0",
        items: req.param("items"),
        status: "OFFERED",
        time: req.param("time"),
        location: { latitude: req.param("latitude"), longitude: req.param("longitude") }
    };

    if (loggedIn === null) {
        logIn(req, res, function() {
            createdonations(e, req, res);
        });
    } else {
        createdonations(e, req, res);
    }
});

function createdonations(e, req, res) {
    var opts = {
        type: "donations"
            //        name: 'Dominos'
    };
    loggedIn.createEntity(opts, function(err, o) {
        if (err) {
            res.send(err);
            return;
        }
        o.set(e);
        o.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }

            res.send("OFFER CREATED");
        });
    });
}

var geo_query = "";
app.get("/vicinitydonations", function(req, res) {
    var criteria =
        "location within " +
        req.param("radius") +
        " of " +
        req.param("latitude") +
        ", " +
        req.param("longitude");
    var count = 100;
    if (req.param("nearest") == "") {
        count = 100;
    } else {
        count = req.param("nearest");
    }
    geo_query = {
        type: "donations?limit=" + count, //Required - the type of collection to be retrieved
        //		qs:criteria
        //        qs: {"ql": "location within 500 of 51.5183638, -0.1712939000000233"}
        qs: { ql: criteria }
    };

    if (loggedIn === null) {
        logIn(req, res, getdonationsbylocation);
    } else {
        //      userid = req.param('userid');
        //      alert("Calling getdonationsbylocation');
        getdonationsbylocation(req, res);
    }
});

function getdonationsbylocation(req, res) {
    loggedIn.createCollection(geo_query, function(err, donations) {
        if (err) {
            res.jsonp(500, { getdonationsbylocation_error: JSON.stringify(err) });
            return;
        }

        var alldonations = [];
        while (donations.hasNextEntity()) {
            var arow = donations.getNextEntity().get();
            /*          var e = { 'ID': arow.uuid,
                              		'name': arow.name,
                                      'street': arow.street,
                                      'address_line2': arow.address_line2,
                                      'city': arow.city,
                                     	'country': arow.country,
                                     'phone': arow.phone,
                                     'email': arow.email,
                  			'Roommate': arow.roommate,
                  			'Movie': arow.movie,
                  			'Travel': arow.travel,
                  			'Room': arow.room,
                  			'EatOut': arow.eatout,
                  			'Hiking': arow.hiking,
                                     'Created': deal.created};*/
            alldonations.push(arow);
        }
        res.jsonp(alldonations);
    });
}
app.get("/creategroup", function(req, res) {
    var group = req.param("group");

    var options = {
        method: "POST",
        endpoint: "groups",
        body: {
            path: group,
            name: group
        }
    };

    if (loggedIn === null) {
        logIn(req, res, function() {
            createGroup(options, req, res);
        });
    } else {
        createGroup(options, req, res);
    }
});

function createGroup(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(201);
        }
    });
}

app.get("/addusertogroup", function(req, res) {
    var group = req.param("group");
    var user = req.param("user");
    var options = {
        method: "POST",
        endpoint: "groups/" + group + "/users/" + user
    };

    if (loggedIn === null) {
        logIn(req, res, function() {
            addUserToGroup(options, req, res);
        });
    } else {
        addUserToGroup(options, req, res);
    }
});

function addUserToGroup(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
}

app.get("/createuser", function(req, res) {
    var fullname = req.param("fullname");
    var password = req.param("password");
    var email = req.param("email");
    var phone = req.param("phone");

    var options = {
        method: "POST",
        endpoint: "users",
        body: {
            username: email,
            name: email,
            email: email,
            fullname: fullname,
            password: password,
            phone: phone
        }
    };

    if (loggedIn === null) {
        logIn(req, res, function() {
            createUser(options, req, res);
        });
    } else {
        createUser(options, req, res);
    }
});

function createUser(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send("CREATED");
        }
    });
}

app.get("/getuser", function(req, res) {
    var email = req.param("email");
    var options2 = {
        type: "users",
        qs: {
            ql: "name='" + email + "'"
        }
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            getuserbyemail(options2, req, res);
        });
    } else {
        getuserbyemail(options2, req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

//Call request to initiate the API call

function getuserbyemail(e, req, res) {
    loggedIn.createCollection(e, function(err, users) {
        if (err) {
            res.jsonp(e);
            return;
        }

        var allusers = [];
        while (users.hasNextEntity()) {
            var auser = users.getNextEntity().get();
            allusers.push(auser);
        }
        if (allusers.length > 0) res.jsonp(allusers);
        else res.send("User Not Found");
    });
}

var login_query = "";

// We need this for UserGrid authentication

function logIn(req, res, next) {
    console.log("Logging in as %s", "sujoyghosal");
    ug.login("sujoyghosal", "Kolkata1", function(err) {
        if (err) {
            console.log("Login failed: %s", JSON.stringify(err));
            res.jsonp(500, { error: err });
            return;
        }

        loggedIn = new usergrid.client({
            orgName: "sujoyghosal",
            appName: "FREECYCLE",
            URI: "https://apibaas-trial.apigee.net",
            authType: usergrid.AUTH_APP_USER,
            token: ug.token,
            logging: true
        });

        console.log("Got a token. I wonder when it expires? Let's guess.");

        // Go on to do what we were trying to do in the first place
        setTimeout(expireToken, 6000);

        next(req, res);
    });
}

function expireToken() {
    console.log("Getting rid of user authentication token");
    if (loggedIn !== null) {
        loggedIn.logout();
        loggedIn = null;
    }
}

// Listen for requests until the server is stopped

app.listen(9000);
console.log("Listening on port 9000");