
const lib = require('./forgot.js');
const { sendEmail } = require("./emailer");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const nodemailer=require("nodemailer");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


const randomString=length=>{
    let text="";
    const possible="abcdefghijklmnopqrstuvwxyz0123456789_-.";
    for(let i=0;i<length;i++){
        text+=possible.charAt(Math.floor(Math.random()*possible.length));

    }
    return text;
}

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
	password: "12345",
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
			res.redirect('/'); //Inside a callback� bulletproof!
		});
	}
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

        // You could use the original name
        cb(null, file.originalname)
    }
});

var upload = multer({storage: storage})

// Upload Image
app.post("/upload", upload.single('photo'), (req, res, next) => {
	console.log("Inside Upload API ")
    return res.json({
        image: req.file.path
    });
});

app.post('/api/forgotpass',(req,res)=>{
    if(!req.body)return res.status(400).json({message:'No Request Body'});
    if(!req.body.email)return res.status(400).json({message:'No Email in Request Body'});
	console.log("Inside Forgot Passowrd Method")
	const token= randomString(40);
	console.log("Token "+token)
    const emailData={
        to:req.body.email,
        subject:"Password Reset Instructions",
        text:'Please use the following link for instructions to reset your password: http:localhost:3000/Signup',
        html:'<p>Please use the link below for instructions to reset your password,</p><p>http:localhost:3000/Signup</p>',
	};
	
	sendEmail(emailData);
        return res.status(200).json({message:'Email has been sent to $(req.body.email}'});``

    // return User
    // .update({email:req.body.email},{$set:{resetPasslink: token}},function(error,feedback){
    // if(error) return res.send(error);
    // else{
    //     sendEmail(emailData);
    //     return res.status(200).json({message:'Email has been sent to $(req.body.email}'});``
    // }
    // })
})

app.listen(3001, () => {
	console.log("running server");
});