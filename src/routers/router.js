const express = require('express');
const router = express.Router();
const { createUser, userLogin, logOut } = require('../controllers/user');
const { createBook, getAllBooks, getAllBookByUser, getBookByBookId, getBookByBookIdUser, updateBook, deleteBook } = require('../controllers/book');

// User APIs
router.post('/createUser', createUser);
router.post('/userLogin', userLogin);
router.post('/logout', logOut);

// Book APIs
router.post('/createBook', createBook);
router.get('/getAllBooks', getAllBooks);
router.get('/getAllBookByUser', getAllBookByUser);
router.get('/getBookByBookId/:bookId', getBookByBookId);
router.get('/getBookByBookIdUser/:bookId', getBookByBookIdUser);
router.put('/updateBook/:bookId', updateBook);
router.delete('/deleteBook/:bookId', deleteBook);

module.exports = router;