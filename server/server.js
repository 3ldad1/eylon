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

app.use(express.static(path.join(__dirname, '/../public')));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index.hbs');
});


app.post('/answer', (req, res) => {
    if (req.files) {
        let file = req.files.filename,
            filename = req.files.filename.name,
            filePath = path.join(__dirname,'../uploads/'+filename);
        file.mv(filePath, (err) => {
            if (err) return res.send(err);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return res.send(err);
                let endIndex = 0, substring='', options, startIndex = 0;

                while (startIndex !== -1) {
                    startIndex = data.indexOf('{', startIndex+substring.length);
                    if (startIndex !== -1) {
                        endIndex = data.indexOf('}', startIndex);
                        substring = data.substring(startIndex+1, endIndex);
                        options = substring.split('|');
                        substring = '{'+options[_.random(0, options.length - 1)]+'}';
                        String.prototype.replaceBetween = function (startIndex, endIndex, substring) {
                            return this.substring(0, startIndex) + substring + this.substring(endIndex);
                        };
                        data = data.replaceBetween(startIndex, endIndex+1, substring);
                    } else {
                        let answerName = filename.replace('.txt','')+'-answer.txt';
                        let uploadPath = path.join(__dirname, '/../uploads/');
                        let newFilePath = uploadPath+answerName;
                        fs.writeFile(newFilePath, data, function (err) {
                            if (err) {
                                return res.send(err);
                            }
                            res.download(newFilePath, 'file.txt',(err)=>{
                                if (err) return res.send(err);
                                fs.unlinkSync(newFilePath);
                                fs.unlinkSync(filePath);
                            });
                        });

                    }
                }


            })
        });





    }
});


// app.post('/answer', (req, res) => {
//     if (req.files) {
//         let file = req.files.filename,
//             filename = req.files.filename.name;
//         file.mv('./uploads/' + filename, (err) => {
//             if (err) {
//                 res.send(err);
//             }
//         });
//         fs.readFile(__dirname + '/../uploads/' + filename, 'utf8', (err, data) => {
//             if (err) res.send(err);
//             let newData = data;
//             for (let i = 1; i <= 30; i++) {
//                 let word = req.body['word' + i];
//                 let replaceOptions = req.body['replaceOptions' + i];
//                 if (replaceOptions && word) {
//                     replaceOptions = _.split(req.body['replaceOptions' + i], ',');
//                     let index = newData.indexOf(word);
//                     while (index !== -1) {
//                         newData = newData.replace(word, replaceOptions[_.random(0, replaceOptions.length - 1)]);
//                         index = newData.indexOf(word);
//                     }
//                 }
//             }
//             let newFile = path.join(__dirname,'/../uploads/answer.txt');
//             fs.writeFile(newFile, newData, function(err) {
//                 if(err) {
//                     return console.log(err);
//                 }
//                 res.download(newFile,'file.txt');
//             });
//         })
//     }
// });


app.listen(port, () => {
    console.log('starting server in port', port);

});

