//node module includes
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
let express = require('express');
var app = require('express')();
var http = require('http').Server(app);
let io = require('socket.io')(http);
const request = require('request');

//custom includes
var Whiteboard = require('./whiteboard.js');
//express client files
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var whiteboard = new Whiteboard.Whiteboard();

io.on('connection', function(socket){
  // console.log('A user connected.');
  // console.log('Assigning player id '+nextPlayerId);
  // socket.playerId = nextPlayerId;
  // nextPlayerId++;
  socket.on('playerName',function(data){
    socket.playerName = data;
    io.emit('shape',whiteboard.getCurrentDrawing());
  });
  socket.on('msg',function(data){
    io.emit('msg',socket.playerName+" : " +data.msg);
  });
  socket.on('shape',function(data){
    io.emit('shape',data);
    whiteboard.addToDrawing(data);
  });
  socket.on('requestDrawing',function(){
    io.emit('shape',whiteboard.getCurrentDrawing());
  });
  socket.on('clearDrawing',function(){
    whiteboard.clearDrawing();
    io.emit('erase');
  });
  // socket.on('playerDie',function(){
  //   game.removePlayer(socket.playerId);
  // });
  // socket.on('disconnect', function(){
  //   console.log('player id '+socket.playerId + ' disconnected');
  //   game.removePlayer(socket.playerId);
  // });
  // socket.on('playerTurn', function(data){
  //   game.turnPlayer(socket.playerId,data);
  // });
  // socket.on('playerGrow', function(){
  //   game.growPlayer(socket.playerId);
  // });
  // socket.on('playerShrink', function(){
  //   game.shrinkPlayer(socket.playerId);
  // });
  // game.emitHighScores();
});



http.listen(process.env.PORT || 3000, function(){});