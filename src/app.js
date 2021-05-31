const express = require("express");
const app = express();

const mongoose = require("mongoose");
const {User} = require("./models/users");
const {Message} = require("./models/messages");

require("./database/connection");
const moment = require("moment");
const socketio = require('socket.io');
const http = require('http');
const server= http.createServer(app);
const io = socketio(server,{
  cors:true,
  allowEIO3:true
});
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getUsersLists
  } = require('../utils/users');

io.on('connection',async socket => {
    console.log("client connected on ",socket.id);

    // socket.on("message",data=>{
    //     console.log("recieve msg",data);
    //     socket.emit("message",data)
    // })

    socket.on("register",async (data)=>{
        console.log("register",data);
        try{
            const registerUser = new User({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
            })
           const registered = await registerUser.save();
        socket.emit("register",registerUser);
    }catch(error){
        console.log(error)
        res.status(400).send(error);
    }})
    
    socket.on("login", async (data)=>{
        try{
            const email = data.email;
            const password = data.password;

            const useremail = await User.findOne({email:email, password:password});
            if(!useremail){
                socket.emit("login","User not found ");
            }

            const user = userJoin(socket.id, useremail.firstname,useremail._id );
            let data1 ={
                message : "login successfully",
                currentUser : useremail,
                socketId : socket.id 
            }
            socket.emit("login",data1);
            socket.emit("getAllUser",getUsersLists());

        }catch (error){
            console.log(error);
          socket.emit("login",error);
        }
    });
    
    //sending message
    socket.on("sendMessageToUser",async data =>{
        let currentUser = await getCurrentUser(socket.id);
        console.log("currentUser",currentUser);
        let touserObj = await getCurrentUser(data.tosocketId);
        console.log("touserObj",touserObj);
        let messageObj = new Message({
            text : data.message,
            to: touserObj.userId,
            from: currentUser.userId,
            
        });
        await messageObj.save();
        
        data.messageId = messageObj._id;
        data.fromsocketId = socket.id;
        socket.emit("sendMessageToUser",data);
        io.to(data.tosocketId).emit("sendMessageToUser",data);
    });

    //delete a message
    socket.on("deleteMessage", async data =>{
        let msgObj = await Message.findOne({_id: data.id});
        if (msgObj){
           await  msgObj.remove();
        }
        socket.emit("deleteMessage","Successfully Deleted");
        io.to(data.tosocketId).emit("deleteMessage", "successfully Deleted");
    })
    //get old message of perticular user
    socket.on("getoldmessages",async data=>{
        let allmessages = await Message.find({to:data.touserId,from:data.fromuserId}).populate("to","firstname").populate("from","firstname");
        socket.emit("getoldmessages",allmessages)
    })

    socket.on('disconnect', function () {
        let userObj = userLeave(socket.id)
        console.log(userObj)
         socket.broadcast.emit('disconnected',socket.id+"user offline");
  
    });

    socket.on("joinRoom",room =>{
        socket.join(room);
    });
    socket.on("groupMsg", ({room, message})=>{
        socket.to(room).emit("message",{
            message
        })
    })

    socket.on('leaveRoom', room => {
        if(socket.room)
            socket.leave(socket.room);
    
        socket.room = room;
        socket.join(room);
    });
  
});

//server is running 
server.listen(3000,()=>{
    console.log("server running on port 3000");
})