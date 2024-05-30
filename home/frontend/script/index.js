var iframe = document.getElementById('iframe');
const sign_up = document.getElementById('sign-up');
sign_up.addEventListener('click',signup);
var user;
function change(name){    
    iframe.style.height = '400px';
    const json = new XMLHttpRequest();
    json.onload = function() {
        const json = this.responseText;
        const obj = JSON.parse(json);
        document.getElementById("details").innerHTML = `<h3>Here are the details about: <h3>"${obj[name]}"`;
        iframe.setAttribute('src',`https://www.wikipedia.org/wiki/${obj[name]}`);
    }
    json.open("get","/elements.json");
    json.send();
};
function details(name,className){
    iframe.style.height = '400px';
    iframe.style.display = 'inline';
    document.getElementById("details").innerHTML = `<h3>Here are the details about: <h3>"${name}"`;
    iframe.setAttribute('src',`https://www.wikipedia.org/wiki/${name}`);
    saperate(className);
}
function unknown(name){
    document.getElementById("details").innerHTML = `<h3>Sorry, No details are available about: <h3>"${name}"`;
    iframe.setAttribute('src','');
    iframe.style.display = 'none';
    const elements = document.querySelectorAll('.highlighted');
    for(let i = 0;i<elements.length; i++){
        elements[i].classList.remove('highlighted');
    }
    saperate(name)
}
function saperate(className){
    const element = document.querySelectorAll('.'+className);
    for(i in element){
        element[i].classList.add('highlighted');
    }
};
function desaperate(name,className){
    const elements = document.querySelectorAll('.highlighted');
    for(let i = 0;i<elements.length; i++){
        elements[i].classList.remove('highlighted');
    }
    details(name,className)
}
function signup(){
    document.getElementsByClassName('sign-up')[0].style.display ='block';
    document.getElementsByClassName('sign-up')[0].style.border ='5px solid gold';
    document.getElementsByClassName('sign-up')[0].style.height ='130px';
    sign_up.style.display = 'none';
}
if(user == undefined){
    const logged_user = new XMLHttpRequest();
    logged_user.onload = function(){
        user = this.responseText;
        if(user !== 'false'){
            document.getElementById('sign-up').innerHTML = this.responseText;
            document.getElementsByClassName('sign-up')[3].innerHTML = '<a href="/log-out">Log-Out</a>';
        }
    }
    logged_user.open('get','/loggeduser');
    logged_user.send();
}
