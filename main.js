var express = require("express")
var app = express();
const port = 8080


/* Home Page */
app.get('/', () => { // home page
	// TODO: how do we support page title dynamically loading into the header template?
	// TODO: load header and page title based on page 
});

app.get('/login', () => {

});


app.get('/register', () => {

});

// TODO: what do we name the buisness logic?`
app.get('/???', () => {

});
app.listen(port, () => console.log("listening..."));
