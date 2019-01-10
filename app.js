const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
const cors =require('cors');

const app = express();
const port = 3500;

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
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: ""
    }
});
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.post('/send', function (req, res) {
    var mailOptions = {
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    }
    console.log(mailOptions);
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