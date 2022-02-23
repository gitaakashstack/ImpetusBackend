const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const Message = require("./models/message");
const Users = require("./models/Users");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
dotenv.config({ path: "./config.env" });
const Razorpay = require("razorpay");
const shortid = require("shortid");
const authenticate = require("./middlewares/authenticate.js");
const adminauthenticate = require("./middlewares/adminauthenticate.js");
const caauthenticate = require("./middlewares/caauthenticate");
const Paid = require("./models/Payments");
const Admin = require("./models/Admins");
const LeaderShipSchema = require("./models/AdminLeaderShip.js");
const Cambass = require("./models/Cambas.js");
const Verify = require("./models/verifyAccount");
const { mongoose } = require("mongoose");

require("./db/connection");
app.use(cookieParser());
const corsOptions = {
  // "https://frontimpetus.herokuapp.com"
  origin: true, //included origin as true
  credentials: true, //included credentials as true
  exposedHeaders: ["set-cookie"],
};
app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi");
});

function nodeMailer(email, name, subject, body) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "contact.impetus5@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  let mailOptions = {
    from: "contact.impetus5@gmail.com",
    to: email,
    subject: subject,
    html: body,
    attachments: [
      {
        filename: "impetus-logo-navbar copy.png",
        path: "./impetus-logo-navbar copy.png",
      },
    ],
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("error didn't sent to ", email);
      transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("error didn't sent to ", email);
    } else {
      console.log("email sent to ", email);
    }
  });
    } else {
      console.log("email sent to ", email);
    }
  });
}

// ----------------------------RAZORPAY-------------------------------------------
let events = [
  {
    id: 1,
    amount: 50,
  },
  {
    id: 2,
    amount: 60,
  },
  {
    id: 3,
    amount: 100,
  },
  {
    id: 4,
    amount: 160,
  },
  {
    id: 5,
    amount: 80,
  },
  {
    id: 6,
    amount: 40,
  },
  {
    id: 7,
    amount: 30,
  },
  {
    id: 8,
    amount: 200,
  },
  {
    id: 9,
    amount: 160,
  },{
    id: 10,
    amount: 30,
  },
];
const razorpay = new Razorpay({
  key_id: process.env.RZRPAYKEY,
  key_secret: process.env.RZRPAYSECRETKEY,
});

app.post("/verification", async (req, res) => {
//   const secret = "123456789";
  //console.log(req.body);
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", process.env.RZRPAYSECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  //console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    if (req.body.payload.payment.entity.status === "captured") {
      let { eventName, name, email, phone } =
        req.body.payload.payment.entity.notes;
      let order_id = req.body.payload.payment.entity.order_id;
      let payment_id = req.body.payload.payment.entity.id;
      const payment = await new Paid({
        eventName,
        order_id,
        payment_id,
        phone,
        email,
        name,
      });
      await payment.save();
      nodeMailer(
        email,
        name,
        "Payment",
        `<head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                           <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://cdn4.iconfinder.com/data/icons/eshop/403/37-512.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>

                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${name},</h2>
                                                        <p>Wowwee!You have successfully registered for ${eventName}!
                                                            You're the coolest person in all the land (and I've met a
                                                            lot of really cool people).</p>
                                                        <p>Your Order Id is ${order_id} and your Payment Id is ${payment_id}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>
</body>`
      );
      //console.log("Saved");
    } else {
      //console.log("Ugly");
    }
  } else {
  }
  res.json({ status: "ok" });
});

app.post("/razorpay/:id", async (req, res) => {
  const payment_capture = 1;
  const amount = events[req.params.id].amount;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
  try {
    const response = await razorpay.orders.create(options);
    //console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    //console.log(error);
  }
});

app.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "logo.svg"));
});

// --------------------------Student's LOGIN----------------------------------------
app.post("/contact", async (req, res) => {
  const { name, phone, email, msg } = req.body;
  //console.log(req.body);
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    !name ||
    re.test(String(email).toLowerCase()) === false ||
    phone.trim().length != 10
  ) {
    let error = [];
    if (!name) {
      //console.log("Wrong Input");
      error.push("name");
    }
    if (re.test(String(email).toLowerCase()) === false) {
      //console.log("Wrong Input");
      error.push("email");
    }
    if (phone.trim().length != 10) {
      //console.log("Wrong Input");
      error.push("phone");
    }

    return res.status(400).send({ message: error });
  }
  const messageReady = await new Message({ name, email, phone, msg });
  if (messageReady) {
    const messageStatus = await messageReady.save();
    if (messageStatus) {
      nodeMailer(
        email,
        name,
        "Message Sent",
        `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Mail</title>
      </head>
      <body style = background-color : "#1b3b68" >
      <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
               <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
              <div style="text-align: center;">
              </div>
              <h1 style="text-align: center; color : orange">WELCOME!</h1>
          </div>
          <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
              <p> Hi <b>${name}</b>, <br/>at IMPETUS IIEST, we believe there’s nothing more unstoppable than when people come together. And, we are pleased to welcome you to our community.
              </p>
              <p>
              IMPETUS IIEST’s mission is to create a society of students who will support, challenge, and inspire
                  one another by providing a platform for networking, mentorship, and peer-to-peer learning environment.
              </p>
              <h4>
                  Next, there are few things you need to do.
              </h4>
              <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
          </div>
      </body>
      </html>`
      );
      //console.log("data sent");
      res.status(201).send({ message: "Msg Sent" });
    } else {
      res.status(500).send({ message: "Network Error" });
    }
  }
});

app.post("/verifyemail", async (req, res) => {
  let {
    password,
    email,
    name,
    phone,
    institute,
    branch,
    cpassword,
    referralCode,
  } = req.body;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (
    password.length < 6 ||
    re.test(String(email).toLowerCase()) === false ||
    !name.trim() ||
    phone.length !== 10 ||
    branch.length < 2 ||
    cpassword.includes(password) === false ||
    !institute.trim()
  ) {
    let error = [];
    if (password.length < 6) {
      //console.log("Wrong Input");
      error.push("password");
    }
    if (re.test(String(email).toLowerCase()) === false) {
      //console.log("Wrong Input");
      error.push("email");
    }
    if (!name.trim()) {
      //console.log("Wrong Input");
      error.push("name");
    }
    if (phone.length < 6) {
      //console.log("Wrong Input");
      error.push("phone");
    }
    if (branch.length < 3) {
      error.push("branch");
    }
    if (cpassword.includes(password) === false) {
      error.push("cpassword");
    }
    if (!institute.trim()) {
      error.push("institute");
    }
    if (phone.length !== 10) {
      error.push("phone");
    }
    return res.status(400).send({ message: error });
  }

  const code = shortid.generate();
  const verify = await Verify.findOne({ email });
  if (verify) {
    return res.status(403).send("email already exists !");
  }
  const Leader = await LeaderShipSchema.findOne({ referralCode });
  if(!Leader && referralCode){
    return res.status(405).send({message : "Invalid Referral Code , Try again"});
  }
  password = await bcrypt.hash(password, 12);
  const verification = await new Verify({
    password,
    email,
    name,
    phone,
    institute,
    branch,
    cpassword,
    referralCode,
    code,
  });
  const verif = verification.save();
  if (verif) {
    nodeMailer(
      email,
      name,
      "Account Verification",
      `<head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                          <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://www.kindpng.com/picc/m/20-201825_facebook-checkmark-transparent-facebook-verification-logo-hd-png.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>
                
                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${name},</h2>
                                                        <p>Wowwee! Thanks for registering an account with Impetus 5.0 !
                                                            You're the coolest person in all the land (and I've met a
                                                            lot of really cool people).</p>
                                                        <p>Before we get started, we'll need to verify your email.</p>

                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;"
                                                    align="center">
                                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                                        style="border-collapse:separate;" align="center" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;"
                                                                    align="center" valign="middle" bgcolor="#7289DA"><a
                                                                        href="https://impetus-backend.herokuapp.com/signup/${email}/${code}"
                                                                        style="text-decoration:none;line-height:100%;background:#7289DA;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;"
                                                                        target="_blank">
                                                                        Verify Email
                                                                    </a></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>

</body>`
    );
    return res.status(200).send("email sent");
  }
});

app.get("/signup/:email/:code", async (req, res) => {
  const email = req.params.email;
  const code = req.params.code;

  const codeVerification = await Verify.findOne({ code: code, email: email });
  if(!codeVerification){
            return  res.sendFile( __dirname +  "/invalidCode.html");
  }
  let { password, name, phone, institute, branch, cpassword, referralCode } =
    codeVerification;

  const userExist = await Users.findOne({ email: email });
  if (userExist) {
            return  res.sendFile( __dirname +  "/emailExists.html");
  }
  if (codeVerification) {
    const messageReady = await new Users({
      name,
      email,
      phone,
      institute,
      branch,
      cpassword,
      password,
      referralCode,
    });
    if(referralCode.trim()){
    console.log(referralCode);
    const Leader = await LeaderShipSchema.findOne({ referralCode : referralCode });
    const score = Leader.score;
    LeaderShipSchema.updateOne(
      { referralCode },
      { score: score + 1 },
      function (err) {
        if (err) {
          //console.log(err);
        } else {
          //console.log("Successfully Updated The Document");
        }
      }
    );
}
    if (messageReady) {
      const messageStatus = await messageReady.save();
      // res.status(201).send({message : "Account Verified"});
     res.sendFile( __dirname +  "/index.html");
      if (messageStatus) {
        //console.log("data sent");
        nodeMailer(
          email,
          name,
          "Account Created",
          `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Mail</title>
      </head>
      <body style = background-color : "#1b3b68" >
      <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
               <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
              <div style="text-align: center;">
              </div>
              <h1 style="text-align: center; color : orange">Thank You !</h1>
          </div>
          <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
              <p> Hi <b>${name}</b>, <br/> We are glad to have you in our community.
              </p>
              <p>
              Stay Tuned for future programmes !
              </p>
              <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
          </div>
      </body>
      </html>`
        );
    //     if(referralCode.trim() !== ""){
    //     nodeMailer(
    //       Leader.email,
    //       Leader.name,
    //       "Account Created",
    //       `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //       <meta charset="UTF-8">
    //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Welcome Mail</title>
    //   </head>
    //   <body style = background-color : "#1b3b68" >
    //   <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
    //            <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
    //           <div style="text-align: center;">
    //           </div>
    //           <h1 style="text-align: center; color : orange">Thank You !</h1>
    //       </div>
    //       <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
    //           <p> Hi <b>${Leader.name}</b>, <br/>  ${name} registered through your referral code in our community.
    //           </p>
    //           <p>
    //           Check your LeaderShip Status !
    //           </p>
    //           <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
    //       </div>
    //   </body>
    //   </html>`
    //     );
    //      return res.sendFile( __dirname +  "/index.html");
    //   }
        return  res.sendFile( __dirname +  "/index.html");
      } else {
        return res.status(500).send({ message: "Network Error" });
      }
    }
  } else {
            return  res.sendFile( __dirname +  "/invalidCode.html");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (password.trim() === "" || email.includes("@") !== true)
    return res.status(400).send({ message: "Wrong" });
  const userExists = await Users.findOne({ email: email });
  if (userExists) {
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (isMatch) {
      const token = await jwt.sign({ _id: userExists._id }, process.env.SECRET);
      res
        .cookie("jwtoken", token, {
          expires: new Date(Date.now() + 86400000),
          secure: true,
          sameSite: "none",
        })
        .status(201)
        .send({ token: token , userData : userExists });
    } else {
      res.status(401).json({ message: "Wrong Credentials" });
    }
  } else {
      const userExists2 = await Verify.findOne({ email: email });
      if(userExists2){
      return res.status(401).json({message : "Account not verified."});
      }else
    res.status(404).json({ message: "Network Error" });
  }
});

app.post("/forgot", async (req, res) => {
  const { email } = req.body;
  if (email.includes("@") !== true)
    return res.status(400).send({ message: "Invalid Email ID" });
  const userExists = await Users.findOne({ email: email });
  if (userExists) {
    const passAccess = userExists.cpassword;
    nodeMailer(
      email,
      userExists.name,
      "Account Recovery",
      `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Recovery Mail</title>
    </head>
    <body>
    <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
        <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
            <div style="text-align: center;">
            </div>
            <h1 style="text-align: center; color : orange">Forgot Your Password ?</h1>
        </div>
        <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
            <p> Hi <b>${userExists.name}</b>, <br/> Don't worry here is your password <br/> <b>"${passAccess}"<b/>.
            </p>
            <p>
             Please don't forget it from now ! 
            </p>
            <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
        </div>
    </body>
    </html>`
    );
    res.status(200).send("Password sent successfully");
  } else {
    res.status(404).json({ message: "Account does not exists !" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwtoken");
  res.status(200).send("Successfully Logged Out");
});

app.get("/about", authenticate, async(req, res) => {

  const paidEvents = await Paid.find({email : req.rootUser.email});
  //console.log(paidEvents);
  const {email , institute , branch , phone , name } = req.rootUser;
  const userData = {email , institute , branch , name , phone , paidEvents}

  res.status(200).send(userData);
});

// ----------------------------------CAMPUS AMBASSADOR -----------------------------------------------------


app.post("/casignup", async (req, res) => {
  let {
    password,
    email,
    name,
    phone,
    institute,
    branch,
    cpassword,
    code,
    referralCode,
  } = req.body;
  let score = 0;
  //console.log(req.body);
  if (code != process.env.CAACCOUNTSECRET) {
    return res.status(401).send({ message: "Not Authorized !!!!!" });
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    password.length < 6 ||
    re.test(String(email).toLowerCase()) === false ||
    !name.trim() ||
    phone.length !== 10 ||
    branch.length < 2 ||
    cpassword.includes(password) === false ||
    !institute.trim()
  ) {
    let error = [];
    if (password.length < 6) {
      //console.log("Wrong Input");
      error.push("password");
    }
    if (re.test(String(email).toLowerCase()) === false) {
      //console.log("Wrong Input");
      error.push("email");
    }
    if (!name.trim()) {
      //console.log("Wrong Input");
      error.push("name");
    }
    if (phone.length < 6) {
      //console.log("Wrong Input");
      error.push("phone");
    }
    if (branch.length < 3) {
      error.push("branch");
    }
    if (cpassword.includes(password) === false) {
      error.push("cpassword");
    }
    if (!institute.trim()) {
      error.push("institute");
    }
    if (phone.length !== 10) {
      error.push("phone");
    }
    return res.status(400).send({ message: error });
  }
  const referral = await Cambass.findOne({referralCode : referralCode});
  if(referral){
    return res.status(403).send({message : "Referral Code exists !"});
  }
  const userExist = await Cambass.findOne({ email: email });
  if (userExist) {
    return res.status(403).send({ message: "Email already exists !" });
  }
  password = await bcrypt.hash(password, 12);
  //console.log(password);
  const messageReady = await new Cambass({
    name,
    email,
    phone,
    institute,
    branch,
    cpassword,
    password,
    referralCode,
  });
  const LeaderShip = await new LeaderShipSchema({
    name,
    email,
    phone,
    institute,
    branch,
    score,
    referralCode,
  });
  if (messageReady && LeaderShip) {
    const messageStatus = await messageReady.save();
    const lead = await LeaderShip.save();
    if (messageStatus) {
      //console.log("data sent");

      nodeMailer(
        email,
        name,
        "Account Created as Campus Ambassador for IMPETUS !",
        `
  <head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                        <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Yes_Check_Circle.svg/2048px-Yes_Check_Circle.svg.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>

                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${name},</h2>
                                                        <p>Wowwee!<br/>You have successfully registered as a Campus Ambassador of ${institute} !
                                                            You're the coolest person in all the land (and I've met a
                                                            lot of really cool people).</p>
                                                        <p>Your Referral Code  is <strong>${referralCode}</strong>.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>

</body>`
      );

      res.status(201).send({ message: "Account Created" });
    } else {
      res.status(500).send({ message: "Network Error" });
      //console.log("Error");
    }
  }
});

app.post("/calogin", async (req, res) => {
  const { email, password } = req.body;
  if (password.trim() === "" || email.includes("@") !== true)
    return res.status(400).send({ message: "Invalid credentials !" });
  const userExists = await Cambass.findOne({ email: email });
  if (userExists) {
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (isMatch) {
      const token = await jwt.sign({ _id: userExists._id }, process.env.SECRET);
      res
        .cookie("cajwtoken", token, {
          expires: new Date(Date.now() + 86400000),
          secure: true,
          sameSite: "none",
        })
        .status(201)
        .send({ token: token , userData : userExists });
    } else {
      res.status(401).json({ message: "Wrong Password" });
    }
  } else {
    res.status(404).json({ message: "Campuss Ambassador not found" });
  }
});

app.get("/calogout", (req, res) => {
  res.clearCookie("cajwtoken");
  res.status(200).send("Successfully Logged Out");
});

app.post("/caforgot", async (req, res) => {
  const { email } = req.body;
  if (email.includes("@") !== true)
    return res.status(400).send({ message: "Invalid credentials" });
  const userExists = await Cambass.findOne({ email: email });
  if (userExists) {
    const passAccess = userExists.cpassword;
    nodeMailer(
      email,
      userExists.name,
      "Campuss Ambassador Account Recovery",
      `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Recovery Mail</title>
    </head>
    <body>
    <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
        <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
            <div style="text-align: center;">
            </div>
            <h1 style="text-align: center; color : orange">Forgot Your Password ?</h1>
        </div>
        <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
            <p> Hi <b>${userExists.name}</b>, <br/> Don't worry here is your password <br/> <b>"${passAccess}"<b/>.
            </p>
            <p>
             Please don't forget it from now ! 
            </p>
            <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
        </div>
    </body>
    </html>`
    );
    res.status(200).send("Password sent successfully");
  } else {
    res.status(404).json({ message: "Account does not exists !" });
  }
});

app.get("/cadashboard", caauthenticate, async (req, res) => {
  const ref = req.rootUser.referralCode;
  //console.log(ref);
  let registrations = await Users.find({ referralCode: ref });
  let score = registrations.length;
  res
    .status(200)
    .send({ score: score, user: req.rootUser, registrations: registrations });
});

// app.get("/messages", caauthenticate, async (req, res) => {
//   let camb = await Cambass.findOne({referralCode});
//   let refCode = camb.referralCode;
//   let count = await Message.count({referralCode : refCode});
//   let messages = await Message.find({referralCode : refCode});
//   res.status(200).send({ messages: count, messagesLegit: messages });
// });

// -------------------------------****************ADMINS****************--------------------------------------------
app.post("/adminsignup", async (req, res) => {
  let { password, email, name, phone, institute, branch, cpassword, code } =
    req.body;
  if (code != process.env.ADMINACCOUNTSECRET) {
    return res.status(401).send({ message: "Not Authorized !!!!!" });
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (
    password.length < 6 ||
    re.test(String(email).toLowerCase()) === false ||
    !name.trim() ||
    phone.length !== 10 ||
    branch.length < 2 ||
    cpassword.includes(password) === false ||
    !institute.trim()
  ) {
    let error = [];
    if (password.length < 6) {
      error.push("password");
    }
    if (re.test(String(email).toLowerCase()) === false) {

      error.push("email");
    }
    if (!name.trim()) {

      error.push("name");
    }
    if (phone.length < 6) {

      error.push("phone");
    }
    if (branch.length < 3) {
      error.push("branch");
    }
    if (cpassword.includes(password) === false) {
      error.push("cpassword");
    }
    if (!institute.trim()) {
      error.push("institute");
    }
    if (phone.length !== 10) {
      error.push("phone");
    }
    return res.status(400).send({ message: error });
  }
  const userExist = await Admin.findOne({ email: email });
  if (userExist) {
    return res.status(403).send({ message: "Email already exists !" });
  }
  password = await bcrypt.hash(password, 12);
  const messageReady = await new Admin({
    name,
    email,
    phone,
    institute,
    branch,
    cpassword,
    password,
    // referralCode
  });
  // const LeaderShip = await new LeaderShipSchema({
  //   name,
  //   email,
  //   phone,
  //   institute,
  //   branch,
  //   score ,
  //   referralCode
  // })
  if (messageReady) {
    const messageStatus = await messageReady.save();
    if (messageStatus) {
      nodeMailer(
        email,
        name,
        "Admin Access to IMPETUS granted !",
        `
   <head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                        <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Yes_Check_Circle.svg/2048px-Yes_Check_Circle.svg.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>

                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${name},</h2>
                                                        <p>Wowwee!<br/>You have successfully registered as an Admin of IMPETUS 5.0 !
                                                            You're the coolest person in all the land (and I've met a
                                                            lot of really cool people).</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>

</body>`
      );
      res.status(201).send({ message: "Account Created" });
    } else {
      res.status(500).send({ message: "Network Error" });
      //console.log("Error");
    }
  }
});

app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  if (password.trim() === "" || email.includes("@") !== true)
    return res.status(400).send({ message: "Invalid credentials !" });
  const userExists = await Admin.findOne({ email: email });
  if (userExists) {
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (isMatch) {
      const token = await jwt.sign({ _id: userExists._id }, process.env.SECRET);
      res
        .cookie("adminjwtoken", token, {
          expires: new Date(Date.now() + 86400000),
          secure: true,
          sameSite: "none",
        })
        .status(201)
        .send({ token: token , userData : userExists});
    } else {
      res.status(401).json({ message: "Wrong Password" });
    }
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
});

app.get("/adminlogout", (req, res) => {
  res.clearCookie("adminjwtoken");
  res.status(200).send("Successfully Logged Out");
});

app.post("/adminforgot", async (req, res) => {
  const { email } = req.body;
  if (email.includes("@") !== true)
    return res.status(400).send({ message: "Invalid credentials" });
  const userExists = await Admin.findOne({ email: email });
  if (userExists) {
    const passAccess = userExists.cpassword;
    nodeMailer(
      email,
      userExists.name,
      "Admin Access Recovery",
      `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Recovery Mail</title>
    </head>
    <body>
    <img src="https://www.iiests.ac.in/assets/images/iiest.png" style="height: auto; width: 100%; max-width: 280px;" />
        <div style="font-family: 'courier new'; color: #676C72; padding: 1rem 1rem 0rem;">
            <div style="text-align: center;">
            </div>
            <h1 style="text-align: center; color : orange">Forgot Your Password ?</h1>
        </div>
        <div style="font-family: 'courier new'; color: #676C72; padding: 0 1rem 1rem 1rem;">
            <p> Hi <b>${userExists.name}</b>, <br/> Don't worry here is your password <br/> <b>"${passAccess}"<b/>.
            </p>
            <p>
             Please don't forget it from now ! 
            </p>
            <p>If you have any queries you can contact me at <a href="https://wa.me/+917980657255" style="word-break: break-word;">https://wa.me/+917980657255</a> (Fauzan Siddiqui CSE 2nd).</p>
        </div>
    </body>
    </html>`
    );
    res.status(200).send("Password sent successfully");
  } else {
    res.status(404).json({ message: "Account does not exists !" });
  }
});

app.get("/registrations", adminauthenticate, async (req, res) => {
  let count = await Users.count();
  let registrations = await Users.find();
  res
    .status(200)
    .send({ registrations: count, registrationsLegit: registrations });
});

app.get("/messages", adminauthenticate, async (req, res) => {
  let count = await Message.count();
  let messages = await Message.find();
  res.status(200).send({ messages: count, messagesLegit: messages });
});

app.post("/sendreminder", adminauthenticate, async (req, res) => {
  const users = await Users.find();
  if (users) {
    let initialIndex = 0 ;
    let finalIndex = 10;
    let maxIndex = users.length;
   let emailMailer =  setInterval(()=>{
 for(let i =  initialIndex ; i<=finalIndex ; i++ ){
        if(users[i]){
          nodeMailer(
        users[i].email,
        users[i].name,
        req.body.subject,
        `<head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                        <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://cdn-icons-png.flaticon.com/512/1792/1792931.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>

                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${users[i].name},</h2>
                                                            <p>${req.body.body}</p>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr> 
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>

</body>`
      )
      }
    }
     initialIndex = finalIndex;
     finalIndex = finalIndex+10;
     maxIndex = maxIndex-10;
    }
    ,5000)
  if(maxIndex===0)
  clearInterval(emailMailer)
//     users.map((user) => {
//       setTimeout(()=> nodeMailer(
//         user.email,
//         user.name,
//         req.body.subject,
//         `<head>
//     <title></title>
//     <!--[if !mso]><!-- -->
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <!--<![endif]-->
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//     <style type="text/css">
//         #outlook a {
//             padding: 0;
//         }

//         .ReadMsgBody {
//             width: 100%;
//         }

//         .ExternalClass {
//             width: 100%;
//         }

//         .ExternalClass * {
//             line-height: 100%;
//         }

//         body {
//             margin: 0;
//             padding: 0;
//             -webkit-text-size-adjust: 100%;
//             -ms-text-size-adjust: 100%;
//         }

//         table,
//         td {
//             border-collapse: collapse;
//         }

//         img {
//             border: 0;
//             height: auto;
//             line-height: 100%;
//             outline: none;
//             text-decoration: none;
//             -ms-interpolation-mode: bicubic;
//         }

//         p {
//             display: block;
//             margin: 13px 0;
//         }
//     </style>
//     <!--[if !mso]><!-->
//     <style type="text/css">
//         @media only screen and (max-width:480px) {
//             @-ms-viewport {
//                 width: 320px;
//             }

//             @viewport {
//                 width: 320px;
//             }
//         }
//     </style>
//     <!--<![endif]-->
//     <!--[if mso]>
// <xml>
//   <o:OfficeDocumentSettings>
//     <o:AllowPNG/>
//     <o:PixelsPerInch>96</o:PixelsPerInch>
//   </o:OfficeDocumentSettings>
// </xml>
// <![endif]-->
//     <!--[if lte mso 11]>
// <style type="text/css">
//   .outlook-group-fix {
//     width:100% !important;
//   }
// </style>
// <![endif]-->

//     <!--[if !mso]><!-->
//     <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
//     <style type="text/css">
//         @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
//     </style>
//     <!--<![endif]-->
//     <style type="text/css">
//         @media only screen and (min-width:480px) {

//             .mj-column-per-100,
//             * [aria-labelledby="mj-column-per-100"] {
//                 width: 100% !important;
//             }
//         }
//     </style>
// </head>

// <body style="background: #F9F9F9;">
//     <div style="background-color:#F9F9F9;">
//         <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//         <style type="text/css">
//             html,
//             body,
//             * {
//                 -webkit-text-size-adjust: none;
//                 text-size-adjust: none;
//             }

//             a {
//                 color: #1EB0F4;
//                 text-decoration: none;
//             }

//             a:hover {
//                 text-decoration: underline;
//             }
//         </style>
//         <div style="margin:0px auto;max-width:640px;background:transparent;">
//             <table role="presentation" cellpadding="0" cellspacing="0"
//                 style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
//                 <tbody>
//                     <tr>
//                         <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
//                             <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
//       <![endif]-->
//                             <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
//                                 style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
//                                 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                     <tbody>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
//                                                 <table role="presentation" cellpadding="0" cellspacing="0"
//                                                     style="border-collapse:collapse;border-spacing:0px;" align="center"
//                                                     border="0">
//                                                     <tbody>
//                                                         <tr>
//                                                             <td style="width:300px;"><a href="https://discordapp.com/"
//                                                                     target="_blank"><img alt="" title="" height="80px"
//                                                                         src="https://www.iiests.ac.in/assets/images/iiest.png"
//                                                                         style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
//                                                                         width="138"></a></td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </table>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//         <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//         <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//         <div
//             style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
//             <div
//                 style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
//                 <!--[if mso | IE]>
//       <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
//         <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
//         <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
//       <![endif]-->
//                 <table role="presentation" cellpadding="0" cellspacing="0"
//                     style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
//                     align="center" border="0"
//                     background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
//                     <tbody>
//                         <tr>
//                             <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
//                                 <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
//       <![endif]-->
//                                 <div
//                                     style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
//                                     Welcome to IMPETUS 5.0 !</div>
//                                 <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//                 <!--[if mso | IE]>
//         </v:textbox>
//       </v:rect>
//       <![endif]-->
//             </div>
//             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//             <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//             <div style="margin:0px auto;max-width:640px;background:#ffffff;">
//                 <table role="presentation" cellpadding="0" cellspacing="0"
//                     style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
//                     <tbody>
//                         <tr>
//                             <td
//                                 style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
//                                 <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
//       <![endif]-->
//                                 <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
//                                     style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
//                                     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                         <tbody>
//                                             <tr>
//                                                 <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
//                                                     align="left">
//                                                     <div
//                                                         style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
//                                                         <p>
//                                                             <div style="display: flex; justify-content: center;">

//                                                                 <img src="https://cdn-icons-png.flaticon.com/512/1792/1792931.png"
//                                                                 alt="Party Wumpus" title="None" width="143px"
//                                                                 style="height: 143px;border-radius:50%;">
//                                                             </div>
//                                                             </p>

//                                                         <h2
//                                                             style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
//                                                             Hey ${user.name},</h2>
//                                                             <p>${req.body.body}</p>
//                                                         </p>
//                                                     </div>
//                                                 </td>
//                                             </tr> 
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                                 <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//             <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//         </div>
//         <div style="margin:0px auto;max-width:640px;background:transparent;">
//             <table role="presentation" cellpadding="0" cellspacing="0"
//                 style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
//                 <tbody>
//                     <tr>
//                         <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
//                             <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
//       <![endif]-->
//                             <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
//                                 style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
//                                 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                     <tbody>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;">
//                                                 <div style="font-size:1px;line-height:12px;">&nbsp;</div>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//         <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//         <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//         <div
//             style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
//             <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
//                 border="0">
//                 <tbody>
//                     <tr>
//                         <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
//                             <!--[if mso | IE]>
//       <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
//       <![endif]-->
//                             <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
//                                 style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
//                                 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                     <tbody>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
//                                                 align="center">
//                                                 <div
//                                                     style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
//                                                     FUN FACT #16</div>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
//                                                 align="center">
//                                                 <div
//                                                     style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
//                                                     In Hearthstone, using the Hunter card Animal Companion against
//                                                     Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
//                                                     usual beasts.
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//         <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//         <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
//         <tr>
//           <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
//       <![endif]-->
//         <div style="margin:0px auto;max-width:640px;background:transparent;">
//             <table role="presentation" cellpadding="0" cellspacing="0"
//                 style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
//                 <tbody>
//                     <tr>
//                         <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
//                             <!--[if mso | IE]>
//       <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
//       <![endif]-->
//                             <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
//                                 style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
//                                 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                     <tbody>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
//                                                 <div
//                                                     style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
//                                                     Sent by IMPETUS 5.0 • 
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
//                                                 <div
//                                                     style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
//                                                 Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
//                                                 Garden, Howrah - 711 103, West Bengal, India.
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//         <!--[if mso | IE]>
//       </td></tr></table>
//       <![endif]-->
//     </div>

// </body>`
//       ),1000);
//     });
    res.status(200).json("Reminder sent successfully");
  } else {
    res.status(404).json({ message: "Account does not exists !" });
  }
});

app.post("/sendmessage", adminauthenticate, async (req, res) => {
  const users = await Users.find();
  const paidUsers = await Paid.find();
  if (paidUsers) {
    res.status(200).json({message : "Sent"});
    paidUsers.filter(event=>event.eventName === req.body.eventName).map((user) => {
      nodeMailer(
        user.email,
        user.name,
        req.body.subject,
        `
   <head>
    <title></title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <!--<![endif]-->
    <!--[if mso]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
  .outlook-group-fix {
    width:100% !important;
  }
</style>
<![endif]-->

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:300px;"><a href="#"
                                                                    target="_blank"><img alt="" title="" height="80px"
                                                                        src="https://www.iiests.ac.in/assets/images/iiest.png"
                                                                        style="border:none;border-radius:13px;display:block;outline:none;text-decoration:none;width:100%;height:58px;"
                                                                        width="138"></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div
                style="margin:0px auto;max-width:640px;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;">
                <!--[if mso | IE]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0" position="0.5,0" type="tile" src="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#7289DA url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;"
                    align="center" border="0"
                    background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png">
                    <tbody>
                        <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:undefined;width:640px;">
      <![endif]-->
                                <div
                                    style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">
                                    Welcome to IMPETUS 5.0 !</div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
      <![endif]-->
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                        <p>
                                                            <div style="display: flex; justify-content: center;">

                                                                <img src="https://cdn-icons-png.flaticon.com/512/1792/1792931.png"
                                                                alt="Party Wumpus" title="None" width="143px"
                                                                style="height: 143px;border-radius:50%;">
                                                            </div>
                                                            </p>

                                                        <h2
                                                            style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">
                                                            Hey ${user.name},</h2>
                                                            <p> Just a reminder about the event you enrolled for ! ;)<b />.
                                                            <p>${req.body.body}</p>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <!--[if mso | IE]>
      <table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#43B581;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:18px;font-weight:bold;line-height:16px;text-align:center;">
                                                    FUN FACT #16</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:14px 70px 30px 70px;"
                                                align="center">
                                                <div
                                                    style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:22px;text-align:center;">
                                                    In Hearthstone, using the Hunter card Animal Companion against
                                                    Kel'Thuzad will summon his cat Mr. Bigglesworth rather than the
                                                    usual beasts.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
        <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="640" align="center" style="width:640px;">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                            <!--[if mso | IE]>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:640px;">
      <![endif]-->
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                    Sent by IMPETUS 5.0 • 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <div
                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                Society of Mechanical Engineering, Indian Institute of Engineering Science and Technology, Shibpur, P.O. - Botanic
                                                Garden, Howrah - 711 103, West Bengal, India.
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
      </td></tr></table>
      <![endif]-->
    </div>

</body>`
      );
    });
  //  return res.status(200).send("Reminder sent successfully");
  } else {
  return  res.status(404).json({ message: "Account does not exists !" });
  }
});

app.get('/leadersScore' , async(req,res)=>{
  let leadersData = await LeaderShipSchema.find();
  leadersData.sort((a, b) => a.score > b.score ? 1: -1);
  res.status(200).send({ leadersData : leadersData });
})

app.get('/eventsregistrations' , async(req,res)=>{
  let eventsregistrations = [0 ,0 ,0,0,0,0,0,0,0,0]
  const paidUsers = await Paid.find();
  paidUsers.map(pd=>{
    if(pd.eventName.includes('CADegorized'))
    eventsregistrations[0] = eventsregistrations[0]+1;
    else if(pd.eventName.includes('Yantra Search'))
    eventsregistrations[1] = eventsregistrations[1]+1;
    else if(pd.eventName.includes('Heatovation'))
    eventsregistrations[2] = eventsregistrations[2]+1;
    else if(pd.eventName.includes('Trade Assemble'))
    eventsregistrations[3] = eventsregistrations[3]+1;
    else if(pd.eventName.includes('Quizario'))
    eventsregistrations[4] = eventsregistrations[4]+1;
    else if(pd.eventName.includes('TrustMe'))
    eventsregistrations[5] = eventsregistrations[5]+1;
    else if(pd.eventName.includes('Chess'))
    eventsregistrations[6] = eventsregistrations[6]+1;
    else if(pd.eventName.includes('Valorant'))
    eventsregistrations[7] = eventsregistrations[7]+1;
    else if(pd.eventName.includes('BGMI'))
    eventsregistrations[8] = eventsregistrations[8]+1;
    else if(pd.eventName.includes('Roadmap - Strategy Design Contest'))
    eventsregistrations[9] = eventsregistrations[9]+1;
  });
  res.send({eventsregistrations : eventsregistrations});
})

app.listen(process.env.PORT || 4000, () => {
  console.log("Listening at 4000");
});
