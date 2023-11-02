const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
  return res.status(200).json({ books });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ book: books[isbn] });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  if (authorBooks.length > 0) {
    return res.status(200).json({ books: authorBooks });
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);
  if (titleBooks.length > 0) {
    return res.status(200).json({ books: titleBooks });
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book or reviews not found" });
  }
});

module.exports.general = public_users;
