const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

var username;

// // Join chatroom
// socket.emit('joinRoom', { username, room });


socket.on("userdetails",message=>{
    username = message.username;
})

socket.on("message", message =>{
    console.log(message);
    //Message from server
     outputMessage(message);

     //Scroll down
     chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("broadcast", function(data){
    document.body.innerHTML = data;
})
//Message submit
chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    //Get Message Text
    const message = e.target.elements.msg.value;

    //Emitting Message to Server
    socket.emit("chatMessage",message);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//Output message display
function outputMessage(message) {
    const div  = document.createElement('div');
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
