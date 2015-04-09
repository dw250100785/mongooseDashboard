var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname, "/client"));
app.set('views', __dirname+'/client/views');

mongoose.connect('mongodb://localhost/mongooseDashboard');

var MongooseSchema = new mongoose.Schema({
	name: String,
	favouriteNumber: Number,
	favouriteColour: String,
	birthDate: Date,
})

MongooseSchema.path('name').required(true, 'Name cannot be blank');
MongooseSchema.path('favouriteNumber').required(true, 'Favourite number cannot be blank');
MongooseSchema.path('favouriteColour').required(true, 'Favourite colour cannot be blank');
MongooseSchema.path('birthDate').required(true, 'Birthdate cannot be blank');

var Mongoose = mongoose.model('Mongoose', MongooseSchema);

app.get('/', function(request,response){
	response.render('index');
})

app.get('/mongooses/new', function(request,response){
	response.render('newMongoose');
})

app.post('/mongooses', function(request, response){
	console.log("POST DATA:", request.body);

	var mongoose = new Mongoose({name:request.body.name, birthDate:request.body.birthDate, favouriteColour:request.body.favouriteColour, favouriteNumber:request.body.favouriteNumber});

	mongoose.save(function(error){
		if(error)
		{
			console.log('something went wrong');
			response.render('newMongoose', {errors: mongoose.errors});
		}
		else
		{
			console.log('successfully added a mongoose!');
			response.redirect('/');
		}
	})
})

app.listen(8000, function() {
 console.log("listening on port 8000");
})