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
            return html + 
            `<figure>
                <figcaption>${episode.title[0]}</figcaption>
                <audio
                    controls
                    duration
                    preload="none"
                    src="${episode.enclosure[0]["$"].url}"
                    type="audio/mpeg">
                    <p>Your browser doesn't support HTML5 audio. Here is a <a href="${episode.enclosure[0]["$"].url}">link to the audio</a> instead.</p> 
                </audio>
            </figure>`
        }, "");
        console.log(podcast);
        wrapper[0].innerHTML += `
            <section class="podcast">
                <picture>
                    <source srcset="${podcast.feed["itunes:image"][0]['$'].href}" media="(min-width: 800px)">
                    <img src="${podcast.feed["itunes:image"][0]['$'].href}"
                        alt="${podcast.feed.title}">
                </picture>
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
