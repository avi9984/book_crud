const Book = require('../models/book');
const { verifyToken } = require('../services/tokenService')

const createBook = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const body = req.body;
            const author = verification.data.data.name;
            const { title, summery } = body
            if (!(title && summery)) {
                return res.status(400).json({ status: false, message: "Title and summery are required" })
            }
            const countBooks = await Book.countDocuments();
            const id = parseInt(countBooks) + 1;
            const obj = {
                bookId: id,
                title: title,
                author: author,
                summery: summery
            }
            const saveBook = await Book.create(obj);
            return res.status(201).json({ status: true, message: "Book created successfully", data: saveBook })
        } else {
            return res.status(401).json({ status: false, message: verification.message });
        }

    } catch (error) {
        console.log(error);
    }
}

const getAllBooks = async (req, res) => {
    try {
        const book = await Book.find({}).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        if (book.length === 0) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }
        return res.status(200).json({ status: true, message: "Get Book found", data: book })
    } catch (error) {
        console.log(error);
    }
}

const getAllBookByUser = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const book = await Book.find({}).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            if (book.length === 0) {
                return res.status(404).json({ status: false, message: "Book not found" });
            }
            return res.status(200).json({ status: true, message: "Book found", data: book })
        } else {
            return res.status(401).json({ status: false, message: verification.message });
        }
    } catch (error) {
        console.log(error);
    }
}

const getBookByBookId = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findOne({ bookId: bookId }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        if (!book) {
            return res.status(404).json({ status: false, message: "Book not found" });
        }
        return res.status(200).json({ status: true, message: "Get Book By Book Id", data: book })
    } catch (error) {
        console.log(error);
    }
}

const getBookByBookIdUser = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const bookId = req.params.bookId;
            const book = await Book.findOne({ bookId: bookId }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            if (!book) {
                return res.status(404).json({ status: false, message: "Book not found" });
            }
            return res.status(200).json({ status: true, message: "Get Book By Book Id", data: book })
        } else {
            return res.status(401).json({ status: false, message: verification.message });
        }
    } catch (error) {
        console.log(error);
    }
}

const updateBook = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const bookId = req.params.bookId;
            const body = req.body;
            const { title, summery } = body;
            const updateBook = await Book.findOneAndUpdate({ bookId: bookId }, { $set: { title: title, summery: summery } }, { new: true }).select({ _id: 0, __v: 0, });
            if (!updateBook) {
                return res.status(404).json({ status: false, message: "Book not found" })
            }
            return res.status(200).json({ status: true, message: "Book updated successfully", data: updateBook });
        } else {
            return res.status(401).json({ status: false, message: verification.message });
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteBook = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const bookId = req.params.bookId;
            const findBook = await Book.findOneAndDelete({ bookId: bookId });
            if (!findBook) {
                return res.status(404).json({ status: false, message: "Book not found or already deleted" });
            }
            return res.status(200).json({ status: true, message: "Book deleted successfully" })
        } else {
            return res.status(401).json({ status: false, message: verification.message });
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = { createBook, getAllBooks, getAllBookByUser, getBookByBookId, getBookByBookIdUser, updateBook, deleteBook }