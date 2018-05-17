const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const busboy = require('connect-busboy');
const app = express();
const fileupload = require("express-fileupload");
const _ = require('lodash');


app.use(bodyParser.urlencoded({extended: false}));
// app.use(busboy());


app.use(bodyParser.json());
app.use(fileupload());

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.post('/answer', (req, res) => {

    if (req.files) {
        let file = req.files.filename,
            filename = req.files.filename.name;
        file.mv('./uploads/' + filename, (err) => {
            if (err) {
                res.send(err);
            }
        });
        fs.readFile(__dirname + '/../uploads/' + filename, 'utf8', (err, data) => {
            if (err) res.send(err);
            let newData = data;
            for (let i = 1; i <= 30; i++) {
                console.log(i);
                let word = req.body['word' + i];
                let replaceOptions = req.body['replaceOptions' + i];
                if (replaceOptions && word) {
                    replaceOptions = _.split(req.body['replaceOptions' + i], ',');
                    let index = newData.indexOf(word);
                    while (index !== -1) {
                        newData = newData.replace(word, replaceOptions[_.random(0, replaceOptions.length - 1)]);
                        console.log(newData);
                        index = newData.indexOf(word);
                    }
                }
            }
            let newFile = path.join(__dirname,'/../uploads/answer.txt');
            fs.writeFile(newFile, newData, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(__dirname);
                res.download(newFile,'file.txt');
            });
        })
    }



});


app.listen(8080, () => {
    console.log('starting server in port 8080');
});

