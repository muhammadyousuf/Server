const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
const cors =require('cors');
var admin = require('firebase-admin');
const app = express();
const port = 3500;

var serviceAccount = require('./serviceAccountKey.json');

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
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "",
        pass: ""
    },
    tls:{
        rejectUnauthorized:false
      }
});
/*------------------SMTP Over-----------------------------*/


app.get('/getByNum',(req,res)=>{
    //get the phoneNum of User
    let phoneNum = req.body.phoneNum
    admin.auth().getUserByPhoneNumber(phoneNum)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data:", userRecord.toJSON());
    let num = userRecord.toJSON().phoneNumber;
    var json = JSON.stringify({phoneNum:num});
   res.end(json);

  })
  .catch(function(error) {
    res.end("Failure");
    console.log("Error fetching user data:", error);
    
  });

})


app.post('/delete', function(req, res){
    let uid = req.body.id
    admin.auth().updateUser(uid, {
        
        disabled: true
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord.toJSON());

          res.end("Chal bhai ho gya ");
        })
        .catch(function(error) {
          console.log("Error updating user:", error);
        });
})

app.post('/send', function (req, res) {
    const output = `
    <h3 style="color:blue, text-align:center" >Near By Mechanic</h3>
    <p>Conform Your Email</p>
    <p>${req.body.start} ${req.body.name}</p>
      
    

    <p>${req.body.code}</p>
    <p>${req.body.message}</p>`;
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secureConnection: true,
        auth: {
            user: "",
            pass: ""
        }
    });
    
    let mailOptions = {
        from: '"Job Alert" hr.mechanicjobs@gmail.com', // sender address
        to: req.body.to, // list of receivers
        subject: 'Mechanic Job', // Subject line
        text: req.body.text, // plain text body
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