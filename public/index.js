let wrapper = document.getElementsByClassName('wrapper');

fetch('http://localhost:3000/get', {
    headers: {'Content-Type':'application/json'},
    mode: 'cors',
    method: 'GET',
})
.then(function(res) {
    return res.json();
    }, function(error) {
    console.log(error);
})
.then(function(podcasts) {
    // let {title, author, summary} = podcast;
    podcasts.forEach(function(podcast) {
        let episodesHTML = podcast.feed.item.reduce((html, episode) => {
            return html + `<h3>${episode.title[0]}</h3>`;
        }, "");
        wrapper[0].innerHTML += `
                <section class="podcast">
                <h2>${podcast.feed.title}</h2>
                <h6>${podcast.feed["itunes:author"]}</h6>
                <details class="podcast-description">
                    <summary>About</summary>
                    ${podcast.feed["itunes:summary"]}
                </details>
                <details class="episodes">
                    <summary>Episodes</summary>
                    ${episodesHTML}
                </details>
            </section>
        `;
    })
})
