var fs = require("fs");
var crypto = require("crypto");
var db = require("./database.js");
var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
const port = 8080

/* Express Middleware */
app.use(express.json());
app.use(cookieParser());
/* Load pages into memory */
var header;
var login;
var home;
var registration;
var listings;
var createListing;
var profile;

// temporary, until db is set up
var users = [];
fs.readFile('header.html', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	header = data;
});

fs.readFile('login.html', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	login = data;
});

fs.readFile('registration.html', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	registration = data;
});

fs.readFile('profile.html', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	profile = data;
});


fs.readFile('home.html', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	home = data;
});

fs.readFile('listings.html', 'utf-8', (err, data) => {
    if (err) { console.log('Error reading listings.html'); return; }
    listings = data;
});

fs.readFile('createListing.html', 'utf-8', (err, data) => {
    if (err) { console.log('Error reading create-listing.html'); return; }
    createListing = data;
});
/* Express Logic */
app.get('/', (req, res) => { // home page
	// TODO: how do we support page title dynamically loading into the header template?
	// TODO: load header and page title based on page 
	var page = `<!DOCTYPE.HTML><html>\n${header + home}</body></html>`
	res.send(page);
	var user = currentUser(req.cookies);
	if (user != null) {
		console.log(user.username + " is logged in");
	}

});

app.get('/login', (req, res) => {
	var page = `<!DOCTYPE.HTML><html>\n${header + login}</body></html>`
	res.send(page);
});

app.post('/login_auth', async (req, res) => {	
	var { username, password } = req.body;
	// TODO: do this with mongoDB instead of in-memory storage
	// use verifyPassword(password, salt, hash) <-- password from post request, salt & hash from MongoDB
	var options = await db.findUser({"_id": username});
	var token = generateToken();
	console.log(options);
	if (options.length != 0) {
		var user = options[0];
		user.token = token;
		if (verifyPassword(password, user.salt, user.password)) {
			await db.updateUser(user);
			res.cookie("sessionID", token)
			res.send();	
		}
	}
});

app.get('/register', (req, res) => {
	var page = `<!DOCTYPE.HTML><html>\n${header + registration}</body></html>`
	res.send(page);
});

app.post('/registration', async (req, res) => {	
	var { username, email, password } = req.body;
	// TODO: query mongo DB for user password & salt
	// use verifyPassword(password, salt, hash) <-- password from post request, salt & hash from MongoDB
	console.log(`username\t${username}\temail\t${email}password\t${password}`);
	var {salt, hash} = hashPassword(password);
	var user = {"username": username, "email": email, "salt": salt, "password": hash, "sessionID": null};
	var options = await db.findUser({"_id":username});
	if (options.length === 0) {
		console.log("does this happen?");
		await db.createUser(user);
	}	
	res.redirect("/login");
	res.send();
});

// Receive listing creation form submission
app.post('/listing/new', (req, res) => {
    var { name, capacity, location, timeslots } = req.body;

    console.log("New listing:", name, capacity, location, timeslots);

    // TODO: Save to MongoDB later
    // For now, just print and redirect back to listings

    res.redirect('/listings');
	res.send();
});


// List all venue/event listings
app.get('/listings', (req, res) => {
    var page = `<!DOCTYPE.HTML><html>${header + listings}</body></html>`;
    res.send(page);
});

app.get('/profile', async (req, res) => {
	var session = req.cookies.sessionID;
	if (session != null) {
		var options = await db.findUser({"token": session});
		if (options.length != 0) {	
			var user = options[0];	
			var page = `<!DOCTYPE.HTML><html>\n${header + profile}</body></html>`; 
			res.send(page);
		} else {
			res.redirect("/login");
			res.send();
		}
	} else {
		res.redirect("/login");
		res.send();
	}
});

app.post('/profile/userTickets', async (req, res) => {
	var session = req.cookies.sessionID;
	var options = await db.findUser({"token": session});
	var user = options[0]
	var ticketIDs = []
	// TODO add users ticket IDs to tickets
	var ticketsHtml = ``;
	//TODO add the ticket info to html
	res.send(ticketsHtml)
	
});

app.post('/profile/userListings', async (req, res) => {
	var session = req.cookies.sessionID;
	var options = await db.findUser({"token": session});
	var user = options[0]
	var listingIDs = []
	// TODO add users ticket IDs to tickets
	var listingsHtml = ``;
	//TODO add the ticket info to html
	res.send(listingsHtml)
});

// Create a new listing (Venue users)
app.get('/createListing', (req, res) => {
	// TODO redirect to Home if not logged in
	/*
	if(currentUser(req.cookies) == null){
		res.redirect('/');
		return;
	}
	*/
    var page = `<!DOCTYPE.HTML><html>${header + createListing}</body></html>`;
    res.send(page);
});
app.listen(port, () => console.log("listening..."));

/* Associated Functions */

// password hash and verification with salt from https://w3schools.com/nodejs/nodejs_crypto.asp/
// TODO: the hash and the salt both need to get saved to mongoDB
function hashPassword(password) {
	var salt = crypto.randomBytes(16).toString('hex');
	var hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return { salt, hash };
}

function verifyPassword(password, salt, hash) {
	const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
	return hashedPassword === hash;
}

function generateToken() {
	return Math.random().toString(36).substr(2);
}

// returns null on no logged in user
// to get cookies, use req.cookies
function currentUser(cookies) {
	for (var user of users) {
		if (user.sessionID === cookies.sessionID) {
			return user;
		}
	}
	return null;
}
