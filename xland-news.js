fetch("xland-news-data.json")
.then(response => response.json())
.then(news => {

    const container = document.getElementById("newsContainer");

    container.innerHTML = "";

    news.forEach(item => {

        container.innerHTML += `

        <div class="news-card">

            <img src="${item.image}" alt="${item.title}" class="news-image">

            <div class="news-info">

                <span class="news-tag">
                    ${item.tag}
                </span>

                <h2>${item.title}</h2>

                <p class="news-date">
                    📅 ${item.date}
                </p>

                <p class="news-description">
                    ${item.description}
                </p>

                <a href="${item.link}" class="read-btn">

                    Read More

                </a>

            </div>

        </div>

        `;

    });

});

