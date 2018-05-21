const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fileUpload = require("express-fileupload");
const _ = require('lodash');
const hbs = require('hbs');


const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({extended: false}));


app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(path.join(__dirname,'/../public')));

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
                let word = req.body['word' + i];
                let replaceOptions = req.body['replaceOptions' + i];
                if (replaceOptions && word) {
                    replaceOptions = _.split(req.body['replaceOptions' + i], ',');
                    let index = newData.indexOf(word);
                    while (index !== -1) {
                        newData = newData.replace(word, replaceOptions[_.random(0, replaceOptions.length - 1)]);
                        index = newData.indexOf(word);
                    }
                }
            }
            let newFile = path.join(__dirname,'/../uploads/answer.txt');
            fs.writeFile(newFile, newData, function(err) {
                if(err) {
                    return console.log(err);
                }
                res.download(newFile,'file.txt');
            });
        })
    }



});


app.listen(port, () => {
    console.log('starting server in port',port);
});

