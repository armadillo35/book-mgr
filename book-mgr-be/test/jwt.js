var jwt = require('jsonwebtoken');

var token = jwt.sign({ 
    account:'a.cc.com',
    _id:'123',
}, 'aabb');

console.log(token);

jwt.verify(token, 'aabb', (err, payload) => {
    console.log(err, payload);

});

