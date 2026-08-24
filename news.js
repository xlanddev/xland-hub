function toggleNews(button){

    const content = button.nextElementSibling;

    if(content.style.display === "block"){

        content.style.display = "none";

        button.innerHTML = "📖 مطالعه خبر ▼";

    }else{

        content.style.display = "block";

        button.innerHTML = "📖 بستن خبر ▲";

    }

}