const numberInput = document.getElementById('mumber'),
textInput = document.getElementById('msg'),
button = document.getElementById('button'),
response = document.querySelector('.response');

button.addEventListener('click',send,false);

const socket = io();
socket.on('smsStatus', function(date){
response.innerHTML='<h5>Matn xabari yuboriladi:' + date.number +'</h5>';
})

function send() {
    const number = numberInput.value.replace(/\D/g,'');
    const text = textInput.value;


    fetch('/', {
        method:'post',
        headers: {
            'Content-type':'application/json'
        },
        body:JSON.stringify({number:number, text:text})
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(err){
        console.log(err);
    });
}

