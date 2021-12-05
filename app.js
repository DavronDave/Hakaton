const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//Init Nexmo
const nexmo = new Nexmo({
    apiKey:'af6080d9',
    apiSecret:'M8NlpBXOZPJFa9jT',
}, {debug:true});

//Init app

const app = express();

//Template engine seyup

app.set('view engine','html');
app.engine('html',ejs.renderFile);

//Public folder setup

app.use(express.static(__dirname + '/public'));

//Body parselmiddleware
app.use(bodyParser.urlencoded({ extended: true }));


//Index route

app.get('/',(req,res) => {
    res.render('index');
});

//Catch route submit

app.post('/', (req,res) => {
    // res.send(req.body);
    // console.log(req.body);
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        '998944765241',number,text,{ type:'unicode'},
        (err, responseDate)=>{
            if(err) {
                console.log(err)
            }
            else {
               console.dir(responseDate); 
               //Get date from response
               const date = {
                   id: responseDate.messages[0]['message-id'],
                   number: responseDate.messages[0]['to']
               }

               //Emit to the client
               io.emit('smsStatus',date);
            }
        }
    );
});


//Define port

const port = 3000;

//Start server

const server = app.listen(port, () => console.log(`Server started onport ${port}`));

//Connect to socket.io
const io = socketio(server);
io.on('connection',(socket) => {
    console.log('Connected');
    io.on('disconnect',() => {
        console.log('Disconnect');
    })

})