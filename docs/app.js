const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const port = 8000;
var newUser;
var username;
var usersPath;
var otp;
var loggeduser;
const app = express();

//function for sending otp on email => sendMail(email);
function sendMail(email){
  otp = (Math. floor(Math. random() * (9999 - 1000 + 1)) + 1000).toString();
  console.log(otp)
  var transporter = nodemailer.createTransport({
    servie :'gmail',
    host : 'smtp.gmail.com',
    auth :{
      user : 'shivamsahu0124@gmail.com',
      pass : 'gmpe qbqs fpjf ahwp'
    }
  });
  var mailOptions = {
    from:'shivamsahu0124@gmail.com',
    to:email,
    subject: 'Confidential',
    text :otp
  };
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      console.log('Invalid email - cant send otp ...');
    }else{
      console.log('email sent...');
    }
  });
  return otp;
}

// functipon for running sql queries => runQuery(query, callback);
function runQuery(query, callback){
  let finalResult;
  const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test' 
  })
  con.query(query,callback);
}

//Default homepage rout
const staticpath = path.join(__dirname ,'../home','frontend');
app.use(express.static(staticpath));

// rout for sign-up page
app.get('/sign-up',(req, res)=>{
  const signupPath = path.join(__dirname,'../signup/index.html');
  res.sendFile(signupPath);
});
app.get('/signup/style.css',(req, res)=>{
  const signupStyle = path.join(__dirname, '../signup/style.css');
  res.sendFile(signupStyle);
});
app.get('/signup/script.js',(req, res)=>{
  const signupScript = path.join(__dirname, '../signup/script.js');
  res.sendFile(signupScript)
});
app.post('/signup/:username,:email,:password',(req, res)=>{
    var request = req.params;
    console.log(request)
    username = request.username;
    usersPath = path.join(__dirname,'users',`${username}.json`);
    newUser = JSON.stringify(request);
    if (fs.existsSync(usersPath)){
        res.write('This username is already taken.');
        res.end();
    } else {
      let email = request.email;
      sendMail(email);
      res.write('true');
        res.end();
    }
});
app.post('/otp/:otp',(req, res)=>{
  const request = req.params;
  if(request.otp == otp){
    let id = Math.floor(otp*Math.random()*123);
    let sqluser = JSON.parse(newUser);
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err){
        console.log(err)
      }else{
        bcrypt.hash(sqluser.password, salt, function(err, hash){
           if(err){
            console.log(err);
           }else{
            sqluser.password = hash;
            const createAccount=(err, data)=>{
              if(err){
                console.log('query didnt work');
              }else{
                console.log( `New user account Created in Mysql`);
                // res.send('true');
              }
              fs.writeFileSync(usersPath,newUser)
              console.log('New user file created in local database');
              res.send('true')
            }
            runQuery(`INSERT INTO test.users (id, Name, Email, Password) VALUES(${id}, "${sqluser.username}","${sqluser.email}", "${hash}" )`,createAccount);
          }
        });
      }
    });
  }
});
//rout for log-in page
app.get('/log-in',(req,res)=>{
  const loginPage = path.join(__dirname,'../login/index.html');
  res.sendFile(loginPage)
});
app.get('/login/index.css',(req, res)=>{
  const loginPageStyle = path.join(__dirname,'../login/index.css');
  res.sendFile(loginPageStyle)
});
app.get('/login/script.js',(req,res)=>{
  const loginPageScript = path.join(__dirname, '../login/script.js');
  res.sendFile(loginPageScript);
});
app.post('/log-in/:username/:password',(req, res)=>{
  const request = req.params;
  let username = request.username;
  let password = request.password;
  const checkUser=(err, data)=>{
    if(err){
      const loginPath = path.join(__dirname, `users/${username}.json`)
      if (fs.existsSync(loginPath)){
        const user = JSON.parse(fs.readFileSync(loginPath));
        if(user.username == username && user.password == password){
          loggeduser = username;
          console.log(loggeduser);
          res.write(loggeduser);
          res.end()
          console.log(username + ' logged in tgrough json file...');
        }else{
          res.send('false');
        }
      } else {
        res.send('false');
      }
    }else{
      if(data[0] == undefined){
        res.send('false');
      }else{
        bcrypt.compare(password,data[0].Password, function(err, result) {
          if(err){
            console.log(err)
          }else{
            if(result){
              loggeduser = username;
              console.log(loggeduser);
              res.send(username);
              console.log('logged in through sql database...')
            }else{
              res.send('false');
            }
          }
        });
      } 
    }
  }
  let query = `SELECT * FROM test.users WHERE Name = "${username}";`
  runQuery(query, checkUser) ;
  })

  //rout for recovering password
app.get('/recovery', (req, res)=>{
  const recovery = path.join(__dirname,'../recover/index.html');
  res.sendFile(recovery);
});
app.get('/recover/style.css', (req, res)=>{
  const recoveryStyle = path.join(__dirname,'../recover/style.css');
  res.sendFile(recoveryStyle);
});
app.get('/recover/script.js', (req, res)=>{
  const recoveryScript = path.join(__dirname,'../recover/script.js');
  res.sendFile(recoveryScript);
});
app.get('/recoveryOTP/:username',(req, res)=>{
  const request = req.params;
  const username = request.username;
  usersPath = path.join(__dirname,'users',`${username}.json`);
  function getMailFromLocal(){
    if (fs.existsSync(usersPath)){
      fs.readFile(usersPath, (err,data)=>{
        obj = JSON.parse(data);
        email = obj.email;
        sendMail(email);
      })
      res.send('true');
      console.log('Email retrived from local database...');
    } else {
      console.log('This user does not exist in local database...');
      res.send('false');
    }
  }
  const getMailFromsql = (err,data)=>{
    if(err){
      console.log('An err occured with mysql database...');
      getMailFromLocal();
    }else if(data[0] == undefined){
      console.log('This user does not exist in mysql database...');
      getMailFromLocal();
    }else{
      console.log('Email retrived from mysql database...');
      const email = data[0].Email;
      sendMail(email);
      res.send('true');
    }
  }
  const query = `SELECT * FROM test.users WHERE Name = "${username}"`;
  runQuery(query, getMailFromsql);
});
app.post('/recovery-otp/:username/:otp',(req, res)=>{
  const request = req.params;
  if(request.otp == otp){
    username = request.username;
    loggeduser = username;
    console.log(loggeduser);
    res.write('true');
    res.end();
  }else{
    res.write('false');
    res.end();
  }
});
// rout for changing password
app.get('/changePassword', (req, res)=>{
  const changePassword = path.join(__dirname,'../change-password/index.html');
  res.sendFile(changePassword);
});
app.get('/changePassword/style.css', (req, res)=>{
  const changePasswordStyle = path.join(__dirname,'../change-password/style.css');
  res.sendFile(changePasswordStyle);
});
app.get('/changePassword/script.js', (req, res)=>{
  const changePasswordScript = path.join(__dirname,'../change-password/script.js');
  res.sendFile(changePasswordScript);
});
app.get('/changeMyPassword/:newPassword',(req, res)=>{
  const request = req.params;
  const userFile = path.join(__dirname,`users/${loggeduser}.json`);
  const userData = JSON.parse(fs.readFileSync(userFile));
  userData.password = request.newPassword;
  const newUserData = JSON.stringify(userData);
  fs.writeFileSync(userFile,newUserData);
  console.log('Password updated in local database...');
  new work
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt){
    if(err){
      console.log('Cannot update password in mysql database...');
    }else{
      bcrypt.hash(request.newPassword, salt, function(err, hash){
         if(err){
          console.log('Cannot update password in mysql database...')
         }else{
           const query = `UPDATE test.users set Password = '${hash}' where Name = "shivam";`
           const updataPassword = (err, result) =>{
            if(err){
              console.log('Cannot update password in mysql database...')
            }else{
              console.log('Password updated in mysql database...');
            }
           }
           runQuery(query, updataPassword);
         }
      });
    }
  });
  
  //end of now work
  res.send('<h1>Password changed successfully!</h1><a href="http://localhost:8000/log-in">Log-in</a>');
});

//rouyt for getting elements json data
app.get('/elements.json',(req,res)=>{
  const elements = path.join(__dirname, "/elements/elements.json");
  const json = fs.readFileSync(elements,"utf-8");
  res.send(json);
});

app.get('/loggeduser',(req, res)=>{
  if(loggeduser == undefined){
    res.send('false');
  }else{
  res.send(loggeduser);
  }
})

//rout for logging out
app.get('/log-out',(req,res)=>{
  res.send("<h1 style='color:lightcoral;filter:blur(0px);margin-top:auto;text-align: center;'>"
    +loggeduser
    +" Logged-Out successfully.</h1><a href='http://localhost:8000/''>Go to homepage</a>");
    console.log(loggeduser);
    console.log('Logged out...')
  loggeduser = undefined;
});

// rout for err 404
app.get('*',(req,res)=>{
  const err404 = path.join(__dirname,'../err404/err404.html');
  res.sendFile(err404);
});

//to listen at port
app.listen(port,()=>{
  console.log(`listening at port : ${port} ;`);
});