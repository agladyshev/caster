fetch('http://localhost:3000/get', {
    headers: {'Content-Type':'application/json'},
    mode: 'cors',
    method: 'GET',
})
.then(function(res) {
    console.log(res.json());
    }, function(error) {
    console.log(error);
});