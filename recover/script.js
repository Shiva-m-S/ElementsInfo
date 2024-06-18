const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
const submitOTP = document.getElementById('submit-otp');
var incorrect = document.getElementById('incorrect');
var username;
submit.addEventListener('click',()=>{
    username = document.getElementById('username').value;
    if(username){
        const recover = new XMLHttpRequest();
        recover.onload = function(){
            if(this.responseText == 'true'){
                document.getElementsByClassName('create-account')[0].style.display = 'none';
                document.getElementsByClassName('login')[0].style.display = 'none';
                document.getElementById('submit').style.display = 'none';
                document.getElementById('reset').style.display = 'none';
                document.getElementById('otp').style.display = 'block';
                incorrect.style.marginTop = '30px';
                incorrect.innerHTML = '';
            }else if(this.responseText == 'false'){
                incorrect.innerHTML = 'Incorrect username.';
            }
        }
        recover.open('get',`/recoveryOTP/${username}`)
        recover.send();
    }else{
        document.getElementById('incorrect').innerText = 'Pleasefill all the fields.';
    }
})
reset.addEventListener('click',()=>{
    const username = document.getElementById('username').value = '';
    incorrect.innerHTML = '';
})
submitOTP.addEventListener('click',()=>{
    const otp = document.getElementById('enter-otp').value;
    if(otp !==''){
        incorrect.innerHTML = '';
        const OTP = new XMLHttpRequest();
        OTP.onload = function(){
            if(this.responseText == 'true'){
                incorrect.innerHTML = 'Correct OTP.<br><a href="/changePassword">Create new password;</a><br><a href="http://localhost:8000">Go to homepage</a>';
            }else if(this.responseText == 'false'){
                incorrect.innerHTML = 'Incorrect OTP';
            }
        }
        OTP.open('post',`/recovery-otp/${username}/${otp}`)
        OTP.send();
    }else{
        document.getElementById('incorrect').innerText = 'Pleasefill all the fields.';
    }

})
