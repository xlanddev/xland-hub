const sidebar = document.getElementById("sidebarTrending");

news.forEach(item => {

    sidebar.innerHTML += `

        <a href="${item.link}">
            📰 ${item.title}
        </a>

    `;

});