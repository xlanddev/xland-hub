const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click",()=>{

const password=document.getElementById("newPassword").value;

if(password==""){

alert("Please enter a password.");

return;

}

const account=JSON.parse(localStorage.getItem("xlandAccount"));

if(!account){

alert("No account found.");

return;

}

const lastChange=localStorage.getItem("lastPasswordChange");

if(lastChange){

const days=(Date.now()-Number(lastChange))/(1000*60*60*24);

if(days<20){

alert("You can change your password again after "+Math.ceil(20-days)+" days.");

return;

}

}

account.password=password;

localStorage.setItem("xlandAccount",JSON.stringify(account));

localStorage.setItem("lastPasswordChange",Date.now());

alert("Password changed successfully!");

window.location.href="xland-script.html";

});