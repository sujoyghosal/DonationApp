var express = require("express");
var app = express();
var path = require("path");
var helmet = require('helmet')
app.use(helmet());
app.use(express.static('www'));
app.use(helmet());
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/ListDonations.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/createRide', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/OfferDonation.html'));
});

app.get('/acceptedrides', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/MyAcceptedRides.html'));
})

app.get('/offeredrides', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/MyOffers.html'));
})

app.get('/myoffers', function(req, res) {
    res.sendFile(path.join(__dirname + '/www/MyOffers.html'));
})
var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});