var fs = require("fs");
var crypto = require("crypto");
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

// temporary, until db is set up
var users = [];
fs.readFile('header.tmp', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	header = data;
});

fs.readFile('login.tmp', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	login = data;
});

fs.readFile('registration.tmp', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	registration = data;
});

fs.readFile('home.tmp', 'utf-8', (err, data) =>  {
	if (err) {
		console.log('Error reading file');
		return;
	}
	home = data;
});

/* Express Logic */
app.get('/', (req, res) => { // home page
	// TODO: how do we support page title dynamically loading into the header template?
	// TODO: load header and page title based on page 
	var page = `<!DOCTYPE.HTML><html>\n$<body>${header + home}</body></html>`
	res.send(page);
});

app.get('/login', (req, res) => {
	var page = `<!DOCTYPE.HTML><html>\n$<body>${header + login}</body></html>`
	res.send(page);
});

app.post('/login_auth', (req, res) => {	
	var { username, password } = req.body;
	// TODO: do this with mongoDB instead of in-memory storage
	// use verifyPassword(password, salt, hash) <-- password from post request, salt & hash from MongoDB
	console.log(`username\t${username}\tpassword\t${password}`);
	for (var i of users) {
		if (i.username === username) {
			if (verifyPassword(password, i.salt, i.password)){
				console.log(`${username} logged in!`);
				res.cookie("user", { "sessionID": generateToken() } 
				i.sessionID = generateToken();
				break;
			}
			else {
				console.log("Incorrect password!");
				break;
			}			
		}
	}
});

app.get('/register', (req, res) => {
	var page = `<!DOCTYPE.HTML><html>\n$<body>${header + registration}</body></html>`
	res.send(page);
});

app.post('/registration', (req, res) => {	
	var { username, email, password } = req.body;
	// TODO: query mongo DB for user password & salt
	// use verifyPassword(password, salt, hash) <-- password from post request, salt & hash from MongoDB
	console.log(`username\t${username}\temail\t${email}password\t${password}`);
	var {salt, hash} = hashPassword(password);
	var user = {"username": username, "email": email, "salt": salt, "password": hash, "sessionID": null};
	var found = 0;
	for (var i of users) {
		if (i.username === username) {
			found = 1;
		}
	}
	
	if (!found) {users.push(user)}
});


// TODO: what do we name the buisness logic pages?
app.get('/buisness-logic-1', () => {

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
	return Math.random.toString(36).substr(2);
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
