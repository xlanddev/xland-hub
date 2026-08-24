const articleId = "news1";

const commentsKey = "comments_" + articleId;

let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];

const list = document.getElementById("commentsList");

const count = document.getElementById("commentCount");

function renderComments(){

list.innerHTML="";

count.textContent="("+comments.length+")";

comments.slice().reverse().forEach(comment=>{

list.innerHTML+=`

<div class="comment-card">

<div class="comment-header">

<span class="comment-user">

👤 ${comment.user}

</span>

<span class="comment-date">

${comment.date}

</span>

</div>

<div class="comment-message">

${comment.text}

</div>

</div>

`;

});

}

document.getElementById("publishComment").onclick=()=>{

const user=document.getElementById("username").value.trim();

const text=document.getElementById("commentText").value.trim();

if(user===""||text===""){

alert("Please fill all fields");

return;

}

comments.push({

user,

text,

date:new Date().toLocaleDateString()

});

localStorage.setItem(commentsKey,JSON.stringify(comments));

document.getElementById("commentText").value="";

renderComments();

}

renderComments();