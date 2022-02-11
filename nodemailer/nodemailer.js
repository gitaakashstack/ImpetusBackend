const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: 'mr.millionaire.siddiqui@gmail.com',
        'pass' : 'junabali786'
    }
});

let mailOptions = {
    from : 'mr.millionaire.siddiqui@gmail.com',
    to: 'fauzan4mak@gmail.com',
    subject : 'Testing and Testing',
    text : 'Hello brother'
};

transporter.sendMail(mailOptions, (err,data)=>{
    if(err){
        console.log("eRrror",err);
    }
    else{
        console.log("email Sent" , data);
    }

});