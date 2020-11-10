const { sendEmail } = require("./emailer");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");

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
	console.log(email);
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
			res.redirect('/');
		});
	}
});

app.get("/students", (req, res) => {
	db.query(
		"SELECT * FROM users ;",
		(err, result) => {
			if (err) {
				res.send({ err: err });
			}
			if (result.length > 0) {
				var results = [];
				result.forEach(function (row) {
					results.push({
						FIRST_NAME: row["FIRST_NAME"],
						LAST_NAME: row["LAST_NAME"],
						EMAIL: row["EMAIL"],
						DOB: row["DOB"],
						PARENT_NAME: row["PARENT_NAME"],
						PARENT_CONTACT_NO: row["PARENT_CONTACT_NO"],
						EDIT: "<a class='btn btn-info btn-sm' href=UpdateStudent?id=" + row["ID"] + "> EDIT </a> &nbsp; <button class='btn btn-danger btn-sm' onClick={this.showAlert}> DELETE </button>"
					})
				})
				res.send(results)
			} else {
				res.send({ message: "No data found, Please try again !!!" });
			}
		}
	);
});

app.get("/getStudentDetails", (req, res) => {
	const studentId = req.query.studentId;
	db.query(
		"SELECT * FROM users WHERE ID = ?;",
		studentId,
		(err, result) => {
			if (err) {
				res.send({ err: err });
			}
			if (result.length > 0) {
				var studentObject = {
					FIRST_NAME: result[0]["FIRST_NAME"],
					LAST_NAME: result[0]["LAST_NAME"],
					EMAIL: result[0]["EMAIL"],
					DOB: result[0]["DOB"],
					PARENT_NAME: result[0]["PARENT_NAME"],
					PARENT_CONTACT_NO: result[0]["PARENT_CONTACT_NO"],
					ID: result[0]["ID"]
				}
				res.send(studentObject)
			} else {
				res.send({ message: "No data found, Please try again !!!" });
			}
		}
	);
});

app.post("/updateStudent", (req, res) => {
	const studentId = req.query.studentId;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const parentName = req.body.parentName;
	const parentContactNumber = req.body.parentContactNumber;
	const DOB = req.body.DOB;
	db.query(
		"UPDATE users SET  FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, PARENT_NAME = ?, PARENT_CONTACT_NO = ?, DOB = ? WHERE ID = ?",
		[firstName, lastName, email, parentName, parentContactNumber, new Date(DOB), studentId],
		(err, result) => {
			if (err) {
				console.log(err);
			}
			res.send(result)
		}
	);
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

app.post("/upload", upload.single('photo'), (req, res, next) => {
	console.log("Inside Upload API ")
    return res.json({
        image: req.file.path
    });
});

app.post('/api/forgotpass',(req,res)=>{
    if(!req.body)return res.status(400).json({message:'No Request Body'});
    if(!req.body.email)return res.status(400).json({message:'No Email in Request Body'});
	console.log("Inside Forgot Password Method")
	const token= randomString(40);
	console.log("Token "+token)
    const emailData={
        to:req.body.email,
        subject:"Password Reset Instructions",
        text:'Please use the following link for instructions to reset your password: http:localhost:3000/Signup',
        html:'<p>Please use the link below for instructions to reset your password,</p><p>http:localhost:3000/Signup</p>',
	};
	sendEmail(emailData);
    return res.status(200).json({message:'Email has been sent to $(req.body.email}'});
})

app.listen(3001, () => {
	console.log("running server");
});