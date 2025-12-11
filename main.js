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
app.get('/', async (req, res) => { // home page
	// TODO: how do we support page title dynamically loading into the header template?
	// TODO: load header and page title based on page 
	var page = `<!DOCTYPE.HTML><html>\n${header + home}</body></html>`
	res.send(page);
	var user = await currentUser(req.cookies);
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
		user.sessionID = token;
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
app.post('/listing/new', async (req, res) => {
    var { name, capacity, location, timeslots } = req.body;

    console.log("New listing:", name, capacity, location, timeslots);

	var session = req.cookies.sessionID;
	if (session != null) {
		var options = await db.findUser({"sessionID": session});
		if (options.length != 0) {	
			var user = options[0];	
			//user.listings.push(name);	
			await db.createListing({"name":name, "capacity":capacity, "location":location, "timeslots":timeslots});
			//res.send();
		} else {
			res.redirect("/login");
			res.send();
		}
	} else {
		res.redirect("/login");
		res.send();
	}
	
    res.redirect('/listings');
	res.send();
});


// List all venue/event listings
app.get('/listings', async (req, res) => {
    try {
        const allListings = await db.getAllListings(); // <--- FETCH from MongoDB

        let listingHTML = "";
        for (let item of allListings) {
            listingHTML += `
                <div class="listing">
                    <h2>${item.name}</h2>
                    <p><strong>Capacity:</strong> ${item.capacity}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Timeslots:</strong> ${item.timeslots.join(", ")}</p>
                </div>
                <hr>
            `;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>Listings</title></head>
            <body>
                ${header}
                <h1>Available Venues & Events</h1>
                ${listingHTML}
            </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading listings");
    }
});

app.get('/profile', async (req, res) => {
	var session = req.cookies.sessionID;
	if (session != null) {
		var options = await db.findUser({"sessionID": session});
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

app.post('/profile/getUsername', async (req, res) => {
	var session = req.cookies.sessionID;
	try {
		var options = await db.findUser({"sessionID": session});
		if (options.length != 0) {	
			var username = options[0].username;
			res.send(username)
			return;
		}
		res.send("username not found");
	}
	catch (err) {
		console.log(err);
		res.status(500).send("Error fetching username");
	}
	
});

app.get("/profile/userTickets", async (req, res) => {
    const session = req.cookies.sessionID;
    if (!session) return res.status(401).json({ error: "Not logged in" });

    const users = await db.findUser({ sessionID: session });
    const user = users[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const tickets = await db.findTicketById({ userId: user._id }); // adjust your query
    res.json(tickets); // send JSON
});

app.post('/profile/userListings', async (req, res) => {
	var session = req.cookies.sessionID;
	var options = await db.findUser({"sessionID": session});
	console.log("listings",options);
	var user = options[0]
	var listingIDs = []
	// TODO add users ticket IDs to tickets
	var listingsHtml = ``;
	//TODO add the ticket info to html
	res.send(listingsHtml)
});

// Create a new listing (Venue users)
app.get('/createListing', async (req, res) => {
	// TODO redirect to Home if not logged in
	var logged_in = await currentUser(req.cookies); 
	if (logged_in) {
    var page = `<!DOCTYPE.HTML><html>${header + createListing}</body></html>`;
    res.send(page);
	}else {

		res.redirect('/');
	}
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
async function currentUser(cookies) {
	if (cookies == null) {
		return undefined;
	}
	var {sessionID} = cookies;	
	var user = await db.findUser({"sessionID": sessionID});
	console.log(user);
	return user[0];
}

