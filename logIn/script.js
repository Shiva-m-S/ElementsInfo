const username = document.getElementById('username');
const password = document.getElementById('password');
const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
reset.addEventListener('click',()=>{
    username.value = '';
    password.value = '';
})
submit.addEventListener('click',()=>{

    if(username.value !=='' && password.value !==''){
        const login = new XMLHttpRequest();
        login .onload = function(){
            if(this.responseText == 'false'){
                document.getElementById('incorrect').innerHTML = 'Incorrect username or password.';
            }else{
                document.getElementsByTagName('body')[0].innerHTML =`<h1>${this.responseText} Logged-In successfully.</h1><a href='http://localhost:8000/'>Go to homepage</a>`;
            }
        }
        login.open('post',`/log-in/${username.value}/${password.value}`);
        login.send();
    }else{
        document.getElementById('incorrect').innerHTML = 'Please fill all the fields.';
    }
})