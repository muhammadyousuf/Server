const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
const cors = require('cors');
var admin = require('firebase-admin');
const app = express();
const port = 3500;

var serviceAccount = require('./serviceAccountKey.json');
app.set('port', (process.env.PORT || 3500));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mechanic-6d028.firebaseio.com'
});

app.use(logger('dev'));

app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Muhammad yousuf');
});


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

/*------------------SMTP Over-----------------------------*/

app.post("/deleted", (req, res) => {
    let uid = req.body.id
    admin.auth().deleteUser(uid)
        .then(function () {
            console.log("Successfully deleted user");
            res.end("Chal bhai ho gya ");
        })
        .catch(function (error) {
            console.log("Error deleting user:", error);
            res.end("Sorry");
        });
})

app.post('/getByNum', (req, res) => {


    //get the phoneNum of User
    let phoneNum = req.body.phoneNum;
    console.log(phoneNum)
    admin.auth().getUserByPhoneNumber(phoneNum)
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully fetched user data:", userRecord.toJSON());
            return res.status(200).json({
                msg: 'Already Exist',
                status: 200
            });
        })
        .catch(function (error) {
            return res.status(200).json({
                msg: error,
                status: 304
            });
        });
})


app.post('/disable', function (req, res) {
    let uid = (req.body.id)
    console.log(uid)
    console.log(typeof (uid))
    admin.auth().updateUser(uid, {
        disabled: true
    })
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully updated user", userRecord.toJSON());
            res.end("Chal bhai ho gya ");
        })
        .catch(function (error) {
            console.log("Error updating user:", error);
        });
})
app.post('/enable', function (req, res) {
    let uid = req.body.id
    console.log(uid)
    admin.auth().updateUser(uid, {

        disabled: false
    })
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully updated user", userRecord.toJSON());

            res.end("Chal bhai ho gya ");
        })
        .catch(function (error) {
            console.log("Error updating user:", error);
        });
})

app.post('/send', function (req, res) {
    const output = `
    <h3 style="color:green; text-align:left; font-family:Times; font-size:24;" >Near By Mechanic</h3>
    <p style="color:black; text-align:left; font-family:Times; font-size:12;text-transform: capitalize;" >${req.body.title} ${req.body.firstname} ${req.body.lastname}</p>
    <p style="color:black; text-align:left; font-family:Times; font-size:12;" >${req.body.message}</p>`;
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secureConnection: true,
        auth: {
            user: "hr.mechanicjobs@gmail.com",
            pass: "hr123456"
        }
    });

    let mailOptions = {
        from: 'hr.mechanicjobs@gmail.com "Job Alert" ', // sender address
        to: req.body.to, // list of receivers
        subject: `${req.body.subject}`, // Subject line
        html: output // html body
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});


app.post('/verification', function (req, res) {
    const output = `
    <h3 style="color:green; text-align:left; font-family:Times; font-size:24;" >Near By Mechanic</h3>
    <p style="color:black; text-align:left; font-family:Times; font-size:12; text-transform: capitalize; " >${req.body.title} ${req.body.firstname} ${req.body.lastname}</p>
    <p style="color:black; text-align:left; font-family:Times; font-size:12;" >${req.body.code}</p>
    <p style="color:black; text-align:left; font-family:Times; font-size:12;" >${req.body.summlink1}</p>
    <p style="color:black; text-align:left; font-family:Times; font-size:12;" >${req.body.link}</p>`;

    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secureConnection: true,
        auth: {
            user: "hr.mechanicjobs@gmail.com",
            pass: "hr123456"
        }
    });

    let mailOptions = {
        from: 'hr.mechanicjobs@gmail.com "Job Alert" ', // sender address
        to: req.body.to, // list of receivers
        subject: `${req.body.subject}`, // Subject line
        html: output // html body
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

app.post('/bills', function (req, res) {
    console.log(req)
    const output = `
    <h3 style="color:green; text-align:left; font-family:Times; font-size:24;" >Near By Mechanic</h3>
    <p style="color:black; text-align:left; font-family:Times; font-size:12; text-transform: capitalize; font-size:20px; font-weight:bold; " >${req.body.firstname} ${req.body.lastname}</p>
    <table  style="border:1px solid black;" >
    <tbody>
    <tr>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:15px " >Account Number</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:15px " >Total Jobs</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:15px " >Start Bill Month</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:15px " >End Bill Month</th>
    </tr>
    <tr style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px; " >
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px; " >${req.body.id}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px; " >${req.body.JobsCount}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px; " >${req.body.startDate}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px; " >${req.body.endDate}</td>
    </tr>
    </tbody>
    </table>
    <br /><br /> 
    <table style="border:1px solid black;"  >
    <tbody>
    <tr>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:14px " >Issue Date</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:14px ">Due Date</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:5px ">Amount Within Due Date</th>
    <th style="color:black; text-align:center; font-family:Times; font-size:22px; border:1px solid black; padding:5px ">Amount After Due Date</th>
    </tr>
    <tr>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px;">${req.body.date}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px;">${req.body.lastDate}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px;">${req.body.bill}</td>
    <td style="color:gray; text-align:center; font-family:Times; font-size:18px; border:1px solid black; padding:5px;">${req.body.billDue}</td>
    </tr>
    </tbody>
    </table>`
        ;

    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secureConnection: true,
        auth: {
            user: "hr.mechanicjobs@gmail.com",
            pass: "hr123456"
        }
    });

    let mailOptions = {
        from: 'hr.mechanicjobs@gmail.com "Job Alert" ', // sender address
        to: req.body.to, // list of receivers
        subject: 'NearBYMechanic BILL', // Subject line
        html: output // html body
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});