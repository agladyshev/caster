let wrapper = document.getElementsByClassName('wrapper');

fetch('http://localhost:3000/get', {
    headers: {'Content-Type':'application/json'},
    mode: 'cors',
    method: 'GET',
})
.then(function(res) {
    // console.log(res.json());
    return res.json();
    }, function(error) {
    console.log(error);
})
.then(function(json) {
    wrapper[0].innerHTML = `<h1>${json.title}</h1>`;
})
