const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

const isValid = (username) => {
  return username && users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    return true;
  }
  return false;
};


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
  return res.status(200).json({ token });
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username, review } = req.body;
  const isbn = req.params.isbn;
  if (!users.some((user) => user.username === username)) {
    return res.status(401).json({ message: "User is not authenticated" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const newReview = { username, review };
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully", review: newReview });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.body;
  const isbn = req.params.isbn;
  if (!users.some((user) => user.username === username)) {
    return res.status(401).json({ message: "User is not authenticated" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
