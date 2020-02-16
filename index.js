const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();

let messages = [];
let currentAuthor = null;

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    response.render('home');
});

app.post('/board', (request, response) => {
    currentAuthor = request.body.author;
    const savedData = fs.readFileSync('./store/messages.json', {encoding:'utf8'});
    messages = JSON.parse(savedData);
    response.render('board', {messages: messages});
    console.log(currentAuthor);
});

app.post('/next', (request, response) => {

    messages.push({
        author: currentAuthor,
        text: request.body.text,
        date: new Date()
    });

    console.log('Array data:\n', messages);
    fs.writeFileSync('./store/messages.json', JSON.stringify(messages), {encoding: 'utf8'});

    response.render('board', {messages: messages});
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('App on port 3000!');
});