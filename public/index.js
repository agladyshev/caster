class CasterApp extends HTMLElement {
    constructor() {
        super();
        this.feed = this.querySelector("podcast-feed");
        this.search = this.querySelector("form.search");
        this.search.addEventListener('submit', this.addPodcast);
    }
    render() {
        this.fetchPodcasts().then(this.feed.render.bind(this.feed), this.handleError);
    }
    fetchPodcasts() {
        return fetch('http://localhost:3000/get', {
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            method: 'GET',
        })
            .then(function (res) {
                return res.json();
            }, function (error) {
                console.log(error);
            })
    }
    addPodcast(event) {
        event.preventDefault();
        fetch('http://localhost:3000/add', {
            headers: { 'Content-Type': 'application/json', 'url': event.target[0].value },
            mode: 'cors',
            method: 'POST',
        })
            .then(function (res) {
                return res.json();
            }, function (error) {
                console.log(error);
            })
            .then(function (podcast) {
                console.log(this);
                // renderPodcast(podcast);
            })

    }
    handleError(e) {
        console.log("Error fetching feed");
        console.log(e);
    }
}

customElements.define("caster-app", CasterApp);

class PodcastFeed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.generateShadowDOM();
    }
    generateShadowDOM() {

    }
    render(podcasts) {
        podcasts.forEach(function generatePodcastElement(data) {
            var podcastElement = document.createElement("podcast-element");
            podcastElement.render(data);
            this.shadowRoot.appendChild(podcastElement);
        }, this);
    }

}

customElements.define("podcast-feed", PodcastFeed);

class PodcastElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    render(podcast) {
        var section = document.createElement("section");
        section.className = "podcast";
        section.innerHTML = `
            <picture>
                <source srcset="${podcast.feed["itunes:image"][0]['$'].href}" media="(min-width: 800px)">
                <img src="${podcast.feed["itunes:image"][0]['$'].href}"
                    alt="${podcast.feed.title}">
            </picture>
            <details class="podcast-description">
                <summary>About</summary>
                ${podcast.feed["itunes:summary"]}
            </details>
        `;
        var details = document.createElement("details");
        details.className = "episodes";
        section.appendChild(details);
        var summary = document.createElement("summary");
        details.appendChild(summary);
        summary.innerText = "Episodes";
        details.appendChild(summary);
        if (podcast.feed.item) {
            this.episodes = podcast.feed.item.map(function generateEpisodeElement(e) {
                var episodeElement = document.createElement("podcast-episode");
                episodeElement.render(e);
                return episodeElement;
            });
            this.episodes.forEach(details.appendChild, details);
            this.shadowRoot.appendChild(section);
        }
    }
}

customElements.define("podcast-element", PodcastElement);

class PodcastEpisode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    render(episode) {
        this.figure = document.createElement("figure");
        this.figure.innerHTML = `
            <figcaption>${episode.title[0]}</figcaption>
            <audio
                controls
                duration
                preload="none"
                src="${episode.enclosure[0]["$"].url}"
                type="audio/mpeg">
                <p>Your browser doesn't support HTML5 audio. Here is a <a href="${episode.enclosure[0]["$"].url}">link to the audio</a> instead.</p> 
                </audio>`
        this.shadowRoot.appendChild(this.figure);
    };
}

customElements.define("podcast-episode", PodcastEpisode);

let app = document.querySelector("caster-app");
app.render();

// app.fetchPodcasts();


