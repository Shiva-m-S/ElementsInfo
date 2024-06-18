const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
var password;
var confirmpassword;
reset.addEventListener('click',()=>{
    password = document.getElementById('password');
    confirmpassword = document.getElementById('confirmpassword');
    password.value = '';
    confirmpassword.value = '';
});
submit.addEventListener('click',()=>{
    password = document.getElementById('password').value;
    confirmpassword = document.getElementById('confirmpassword').value;
    let newPassword;
    if(password == confirmpassword){
        newPassword = password;
        const changePassword = new XMLHttpRequest()
        changePassword.onload = function(){
            if(this.responseText.length < 100){
                console.log(this.responseText.length)
                document.getElementsByTagName('body')[0].innerHTML = this.responseText;
            }else{
                document.getElementById('nomatch').innerHTML = 'Error: Please try after some time.';
            }
        }
        changePassword.open('get',`/changeMyPassword/${newPassword}`);
        changePassword.send();
    }else{
        document.getElementById('nomatch').innerHTML = 'Both fields does not match.';
    }
});
