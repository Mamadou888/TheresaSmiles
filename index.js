var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');

var count = 1;
var item1 = {
  ItemID: "L102",
  Type: "Lighting",
  Brand: "EnergyLossCo",
  Model: "Z-12-6",
  Volume: "600", 
  Watts: "20",
  Cost: "This item will cost you about $12 a year in electricity consumption"
};

var item2 = {
  ItemID: "R132",
  Type: "Refrigerator",
  Brand: "Samsung",
  Model: "S-34-93",
  Volume: "900", 
  Watts: "34",
  Cost: "This item will cost you about $27 a year in electricity consumption"
};

var dict = {
  FirstName: "Chris",
  "one": 1,
  1: "some value"
};

const accountSid = process.env.SID;
const authToken = process.env.KEY;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/incoming', (req, res) => {
    const twiml = new MessagingResponse();

    if (req.body.MediaContentType0 == "image/jpeg") {
      console.log("AN IMAGE IS COMING IN...");
    } else {
      console.log("A TEXT MESSAGE IS COMING IN...");
    }

    console.log(req.body);

    if (count == 1) {
      twiml.message(JSON.stringify(item1));
      count += 1;
    } else if (count == 2) {
      twiml.message(JSON.stringify(item2));
      count = 1;
    } else {
      console.log("ERROR");
      twiml.message(req.body.Body)
    }

    // TODO: 1. Read the barcode/QRCode and get the unique_id of the item from it 
    // TODO: 2. Send a GET request with the unique_id to another server where the chaincode lives, and return the information for item with id unique_id
    // TODO: 3. Format that messagae and insert it into the twiml.message and return it to the user. 

    res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

