const { sendEmail } = require("./emailer");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
var fs = require("fs");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

var fileName = "";
const randomString = length => {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789_-.";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function calculateAge(dateString) {
    var diff_ms = Date.now() - dateString.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function convertDate(date_str) {
    var formattedDate = "";
    if (date_str != undefined && date_str != null) {
        var dateOfBirth = new Date(date_str);
        var month = dateOfBirth.getMonth() + 1
        formattedDate = dateOfBirth.getFullYear() + "-" + month + "-" + dateOfBirth.getDate();
        temp_date = formattedDate.split("-");

        return temp_date[2] + " " + months[Number(temp_date[1]) - 1] + " " + temp_date[0];
    } else {
        return formattedDate;
    }

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

app.use(function(req, res, next) {
    next();
});

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "dost1234",
    database: "school",
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
                            loggedInUserId: result[0].ID,
                            message: "Logged-In Successfully !!!",
                            loggedIn: true
                        }
                        req.session.user = userObject;
                        return res.status(200).json(userObject);
                    } else {
                        return res.status(403).json({ message: 'Please Enter Valid Email Id / Password And Try Again' });
                    }
                });
            } else {
                return res.status(403).json({ message: 'Please Enter Valid Email Id / Password And Try Again' });
            }
        }
    );
});

app.get("/logout", (req, res) => {
    if (req.session.user) {
        req.session.destroy(function (err) {
            return res.status(200).json({ message: '🦄  Successfully Logged Out !!!' });
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
                var count = 1;
                result.forEach(function (row) {
                    results.push({
                        SL: count,
                        FIRST_NAME: row["FIRST_NAME"],
                        LAST_NAME: row["LAST_NAME"],
                        EMAIL: row["EMAIL"],
                        DOB: row["DOB"],
                        PARENT_NAME: row["PARENT_NAME"],
                        PARENT_CONTACT_NO: row["PARENT_CONTACT_NO"],
                        EDIT: "<a class='btn btn-info btn-sm' href=UpdateStudent?id=" + row["ID"] + "> EDIT </a> &nbsp; <button class='btn btn-danger btn-sm' onClick={this.showAlert}> DELETE </button>",
                        AGE: calculateAge(row["DOB"]) + " Year(s)",
                        DATE_FORMATTED: convertDate(row["DOB"])
                    })
                    count++;
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
        console.log(req.body);
        cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
        console.log(req.body);
        if(fileName === ""){
            return res.status(500).json({ message: 'Error while uploading file'});
        }
        cb(null, fileName)
    }
});

var uploaded = multer({ storage: storage })

app.post('/api/forgotpass', (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'No Request Body' });
    if (!req.body.email) return res.status(400).json({ message: 'No Email in Request Body' });
    console.log("Inside Forgot Password Method")
    const token = randomString(40);
    console.log("Token " + token)
    const emailData = {
        to: req.body.email,
        subject: "Password Reset Instructions",
        text: 'Please use the following link for instructions to reset your password: http:localhost:3000/Signup',
        html: '<p>Please use the link below for instructions to reset your password,</p><p>http:localhost:3000/Signup</p>',
    };
    sendEmail(emailData);
    return res.status(200).json({ message: 'Email has been sent to $(req.body.email}' });
})

app.post("/register", function (req, res) {
    try{
        var storage = multer.diskStorage({
            destination: function (req, file, cb, next) {
                cb(null, 'assets/uploads')
            },
            filename: function (req, file, cb, next) {
                cb(null, file.originalname)
                console.log("File Uploaded")
            }
        });
        var upload = multer({ storage: storage }).any();
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error uploading file.'});
            } else {
                var studentObject = JSON.parse(req.body.studentObj)
                const firstName = studentObject.firstName;
                const lastName = studentObject.lastName;
                const email = studentObject.email;
                const password = studentObject.password;
                const parentName = studentObject.parentName;
                const parentContactNumber = studentObject.parentContactNumber;
                const DOB = studentObject.DOB;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal Server Error'});
                    }
                    db.query(
                        "INSERT INTO users (FIRST_NAME, LAST_NAME, EMAIL, PARENT_NAME, PARENT_CONTACT_NO, PASSWORD, CREATED_DATE,DOB) VALUES (?,?,?,?,?,?,?,?)",
                        [firstName, lastName, email, parentName, parentContactNumber, hash, new Date(), new Date(DOB)],
                        (err, result) => {
                            if (result) {
                                req.files.forEach(function (file) {
                                    file.originalname = result.insertId+".jpeg";
                                    uploaded.single(file);
                                });
                                return res.status(200).json({ message: 'Successfully Registered'});
                            }else if(err){
                                return res.status(500).json({ message: 'Internal Server Error'});
                            }
                        }
                    );
                });
            }
        });
    }catch(e){
        console.log(e);
    }
});

app.listen(3001, () => {
    console.log("running server");
});
