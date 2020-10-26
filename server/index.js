const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		key: "userId",
		secret: "subscribe",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: new Date().getTime(),
			expires: new Date(Date.now() + new Date().getTime())
		},
	})
);

const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "dost1234",
	database: "school",
});

app.post("/register", (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const password = req.body.password;
	const parentName = req.body.parentName;
	const parentContactNumber = req.body.parentContactNumber;
	const DOB = req.body.DOB;

	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err) {
			console.log(err);
		}
		db.query(
			"INSERT INTO users (FIRST_NAME, LAST_NAME, EMAIL, PARENT_NAME, PARENT_CONTACT_NO, PASSWORD, CREATED_DATE,DOB) VALUES (?,?,?,?,?,?,?,?)",
			[firstName, lastName, email, parentName, parentContactNumber, hash, new Date(),new Date(DOB)],
			(err, result) => {
				console.log(err);
			}
		);
	});
});

app.get("/login", (req, res) => {
	if (req.session.user) {
		res.send({ loggedIn: true, user: req.session.user });
	} else {
		res.send({ loggedIn: false });
	}
});

app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	db.query(
		"SELECT * FROM users WHERE EMAIL = ?;",
		email,
		(err, result) => {
			if (err) {
				res.send({ err: err });
			}

			if (result.length > 0) {
				bcrypt.compare(password, result[0].PASSWORD, (error, response) => {
					if (response) {
						var userObject = {
							loggedInUserFullName: result[0].FIRST_NAME + " " + result[0].LAST_NAME,
							loggedInUserEmail: result[0].EMAIL,
							loggedInUserId: result[0].ID
						}
						req.session.user = userObject;
						res.send(userObject);
					} else {
						res.send({ message: "Wrong username/password combination!" });
					}
				});
			} else {
				res.send({ message: "User doesn't exist" });
			}
		}
	);
});

app.get("/logout", (req, res) => {
	if (req.session.user) {
		req.session.destroy(function (err) {
			res.redirect('/'); //Inside a callback… bulletproof!
		});
	}
});

app.listen(3001, () => {
	console.log("running server");
});
