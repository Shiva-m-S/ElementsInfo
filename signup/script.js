var submit = document.getElementsByClassName('submit')[0];
var reset = document.getElementsByClassName('reset')[0];
var submitOTP = document.getElementById('submit-otp');

submit.addEventListener('click',()=>{
    const username = document.getElementById('username').value;
    const email = document.getElementById('e-mail').value;
    const password = document.getElementById('password').value;
    const addUser = new XMLHttpRequest();
    addUser.onload = function(){
        if(username !== '' && email !== '' && password !== ''){
            if(this.responseText == 'This username is already taken.'){
                document.getElementById('taken').innerText = this.responseText;
            }else if(this.responseText = 'true'){
                submit.style.display = 'none';
                reset.style.display = 'none';
                document.getElementById('already').style.display = 'none';
                document.getElementById('otp').style.display = 'block';
            }
        }else{
            document.getElementById('invalid').innerText = 'Please fill al the fields.';

        }
    }
    addUser.open('post',`/signup/${username},${email},${password}`);
    addUser.send();
});
reset.addEventListener('click',()=>{
    const username = document.getElementById('username');
    const email = document.getElementById('e-mail');
    const password = document.getElementById('password');
    username.value = '';
    email.value= '';
    password.value = '';
})
submitOTP.addEventListener('click',()=>{
    const submittedOTP = document.getElementById('enter-otp').value;
    const OTP = new XMLHttpRequest();
    OTP.onload= function(){
        if(this.responseText == 'true'){
            document.getElementsByTagName('body')[0].innerHTML = '<h1>Account created successfully!</h1><a href="/log-in">Log-In</a>'
        }else if(this.responseText == 'false'){
            document.getElementById('invalid').innerText = 'Incorrect OTP';
        }
    }
    OTP.open('post',`/otp/${submittedOTP}`);
    OTP.send();
});

    
