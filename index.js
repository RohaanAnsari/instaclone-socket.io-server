var PORT = process.env.PORT || 5500;

const io = require('socket.io')(PORT, {
  cors: {
    origin: 'https://insta-clone-front-end.herokuapp.com',
  },
  autoConnect: false,
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('a user connected.');

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  socket.on('disconnect', () => {
    // io.emit('getUsers', users);
    // console.log('a user disconnected!');
    // socket.removeAllListeners('sendMessage');
    // socket.removeAllListeners('disconnect');
    // io.removeAllListeners('connection');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
