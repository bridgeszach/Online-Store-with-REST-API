var http = require('http');
var express = require('express'); // external lib

/************************* 
 * Configuration Section
 ************************/
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Allow CORS Policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// DB connection settings
var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;


/*****************************
 * Web Server Functionality
 ****************************/
app.get('/', function (req, res) {
    console.log("Request on root page");
    res.send('<h1>Hello World!</h1>');
});

app.get('/about', function (req, res) {
    res.send("I'm Zach Bridges");
});

/********************* 
 * API Functionality 
 ********************/

var ItemDB; // this is the model for DB items


app.get('/API/items', function (req, res) {
    ItemDB.find({}, function (error, data) {
        if (error) {
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }

        // no error
        res.status(200);
        res.json(data);
    });
});

app.get('/api/items/:name', function (req, res) {
    var name = req.params.name;
    ItemDB.find({
        user: name
    }, function (error, data) {
        if (error) {
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }

        // no error
        res.status(200);
        res.json(data);
    });
});

app.get('/api/items/priceLowerThan/:price', function (req, res) {
    var val = req.params.price;
    ItemDB.find({
        price: {
            $lte: val
        }
    }, function (error, data) {
        if (error) {
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }
        // no error
        res.status(200);
        res.json(data);
    })
});




app.post('/api/items', function (req, res) {

    // var item = req.body;
    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(function (error, savedItem) {
        if (error) {
            console.log("Error saving object. " + error);
            res.status(500); // http status 500: Internal Server Error
            res.send(error);
        }

        // No error
        console.log("Object Saved!");
        res.status(201); // 201: Created
        res.json(savedItem);
    });
});


/** Start the server and DB check connection **/

db.on('open', function () {
    console.log('Database Status: Connected.');

    /*
        Data types allowed for schemas:
        String, Number, Date, Buffer, Boolean, ObjectId, Array
*/

    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String
    });

    // create obj constructor
    ItemDB = mongoose.model('itemsCH7', itemSchema);
});

db.on('error', function (details) {
    console.log('Error: DB connection error')
    console.log("Error details: " + details);
});

app.listen(8080, function () {
    console.log("Server running at localhost:8080");
});