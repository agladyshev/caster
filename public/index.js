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
.then(function(podcast) {
    // let {title, author, summary} = podcast;
    wrapper[0].innerHTML = `
            <section class="podcast">
            <h2>${podcast.title}</h2>
            <h6>${podcast["itunes:author"]}</h6>
            <details class="podcast-description">
                <summary>About</summary>
                ${podcast["itunes:summary"]}
            </details>
            <details class="episodes">
                <summary>Episodes</summary>
            </details>
        </section>
    `;
    let episodesHTML = wrapper[0].querySelector(".episodes");
    let episodes = podcast.item;
    episodes.forEach(episode => {
        console.log(episode.title);
        episodesHTML.innerHTML += `<h3>${episode.title[0]}</h3>`
    });
})
