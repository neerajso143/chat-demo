const users = [];

// Join user to chat
function userJoin(socketId, username,userId) {
  const user = { socketId, username, userId };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(socketId) {
  return users.find(user => user.socketId === socketId);
  }
  
// User leaves chat
function userLeave(socketId) {
    const index = users.findIndex(user => user.socketId === socketId);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
// Get room users
function getUsersLists() {
  return users
  }

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsersLists
}