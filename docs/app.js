const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer')
const staticpath = path.join(__dirname ,'../home','frontend');
const port = 8000;
var newUser;
var username;
var usersPath;
var otp;
var loggeduser;
app.use(express.static(staticpath));
app.get('/sign-up',(req, res)=>{
  const signupPath = path.join(__dirname,'../signup/index.html')
  res.sendFile(signupPath);
});
app.get('/signup/style.css',(req, res)=>{
  const signupStyle = path.join(__dirname, '../signup/style.css')
  res.sendFile(signupStyle)
});
app.get('/signup/script.js',(req, res)=>{
  const signupScript = path.join(__dirname, '../signup/script.js')
  res.sendFile(signupScript)
});
app.post('/signup/:username,:email,:password',(req, res)=>{
    var request = req.params;
    username = request.username;
    usersPath = path.join(__dirname,'users',`${username}.json`);
    newUser = JSON.stringify(request);
    if (fs.existsSync(usersPath)){
        res.write('This username is already taken.');
        res.end();
    } else {
      otp = (Math. floor(Math. random() * (9999 - 1000 + 1)) + 1000).toString();
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
        to: request.email,
        subject: 'Confidential',
        text :otp
      };
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error);
        }else{
          console.log('email sent: '+info.response)
        }
      });
      res.write('true');
        res.end();
    }
});
app.post('/otp/:otp',(req, res)=>{
  const request = req.params;
  if(request.otp == otp){
    res.send('true');
    fs.writeFileSync(usersPath,newUser)
    loggeduser = username;
  }else{
    res.send('false');
  }
});
app.get('/log-in',(req,res)=>{
  const loginPage = path.join(__dirname,'../login/index.html')
  res.sendFile(loginPage)
});
app.get('/login/index.css',(req, res)=>{
  const loginPageStyle = path.join(__dirname,'../login/index.css')
  res.sendFile(loginPageStyle)
});
app.get('/login/script.js',(req,res)=>{
  const loginPageScript = path.join(__dirname, '../login/script.js')
  res.sendFile(loginPageScript);
});
app.post('/log-in/:username/:password',(req, res)=>{
  const request = req.params;
  username = request.username;
  const loginPath = path.join(__dirname, `users/${request.username}.json`)
  if (fs.existsSync(loginPath)){
    const user = JSON.parse(fs.readFileSync(loginPath));
    if(user.username == request.username && user.password == request.password){
      loggeduser = username;
      res.write(loggeduser);
      res.end()
    }else{
      res.send('false');
    }
  } else {
    res.send('false');
  }
});
app.get('/recovery', (req, res)=>{
  const recovery = path.join(__dirname,'../recover/index.html')
  res.sendFile(recovery);
});
app.get('/recover/style.css', (req, res)=>{
  const recoveryStyle = path.join(__dirname,'../recover/style.css')
  res.sendFile(recoveryStyle);
});
app.get('/recover/script.js', (req, res)=>{
  const recoveryScript = path.join(__dirname,'../recover/script.js')
  res.sendFile(recoveryScript);
});
app.get('/recoveryOTP/:username',(req, res)=>{
  otp = (Math. floor(Math. random() * (9999 - 1000 + 1)) + 1000).toString();
  const request = req.params;
  const username = request.username;
  usersPath = path.join(__dirname,'users',`${username}.json`);
  if (fs.existsSync(usersPath)){
    fs.readFile(usersPath, (err,data)=>{
      obj = JSON.parse(data);
      email = obj.email;
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
        to: email,
        subject: 'Confidential',
        text :otp
      };
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error);
        }else{
          console.log('email sent: '+info.response)
        }
      });
    })
    res.write('true');
    res.end();
  } else {
    res.send('false');
  }
});
app.post('/recovery-otp/:username/:otp',(req, res)=>{
  const request = req.params;
  if(request.otp == otp){
    username = request.username;
    loggeduser = username;
    res.write('true');
    res.end();
  }else{
    res.write('false');
    res.end();
  }
});
app.get('/changePassword', (req, res)=>{
  const changePassword = path.join(__dirname,'../change-password/index.html')
  res.sendFile(changePassword);
});
app.get('/changePassword/style.css', (req, res)=>{
  const changePasswordStyle = path.join(__dirname,'../change-password/style.css')
  res.sendFile(changePasswordStyle);
});
app.get('/changePassword/script.js', (req, res)=>{
  const changePasswordScript = path.join(__dirname,'../change-password/script.js')
  res.sendFile(changePasswordScript);
});
app.get('/changeMyPassword/:newPassword',(req, res)=>{
  const request = req.params;
  const userFile = path.join(__dirname,`users/${loggeduser}.json`);
  const userData = JSON.parse(fs.readFileSync(userFile));
  userData.password = request.newPassword;
  const newUserData = JSON.stringify(userData);
  fs.writeFileSync(userFile,newUserData);
  res.send('<h1>Password changed successfully!</h1>');
});
app.get('/elements.json',(req,res)=>{
  const elements = path.join(__dirname, "/elements/elements.json")
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
app.get('/log-out',(req,res)=>{
  res.send("<h1 style='color:lightcoral;filter:blur(0px);margin-top:auto;text-align: center;'>"+loggeduser+" Logged-Out successfully.</h1><a href='http://localhost:8000/''>Go to homepage</a>");
  loggeduser = undefined;
});
app.get('*',(req,res)=>{
  const err404 = path.join(__dirname,'../err404/err404.html');
  res.sendFile(err404);
});
app.listen(port,()=>{
  console.log(`listening at port : ${port} ;`);
});