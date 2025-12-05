var fs = require("fs");
var crypto = require("crypto");
var express = require("express");
var app = express();
const port = 8080

/* Express Middleware */
app.use(express.json());

/* Load pages into memory */
var header;
var login;

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


/* Express Logic */
app.get('/', () => { // home page
	// TODO: how do we support page title dynamically loading into the header template?
	// TODO: load header and page title based on page 
});

app.get('/login', (req, res) => {
	var page = `<!DOCTYPE.HTML><html>\n$<body>${header}${login}</body></html>`
	res.send(page);
});

app.post('/login_auth', (req, res) => {	
	var { username, password } = req.body;
	// TODO: query mongo DB for user password & salt
	// in mongodb, username will be hashsed.
	// use verifyPassword(password, salt, hash) <-- password from post request, salt & hash from MongoDB
});


app.get('/register', () => {

});

// TODO: what do we name the buisness logic pages?
app.get('/buisness-logic-1', () => {

});
app.listen(port, () => console.log("listening..."));

/* Associated Functions */

// password hash and verification with salt from https://w3schools.com/nodejs/nodejs_crypto.asp/
function hashPassword(password) {
	var salt = crypto.randomBytes(16).toString('hex');
	var hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return { salt, hash };
}

function verifyPassword(password, salt, hash) {
	const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hash');
	return hashedPassword === hash;
}


