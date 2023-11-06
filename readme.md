# Book CURD 

## User APIs
``http://localhost:5001/createUser`` This API will create a new user.

```http://localhost:5001/userLogin``` This API will user login and create the jwt token and refresh token.

```http://localhost:5001/logOut``` User will be logged out this api take a token in headers.

## Book APIs

``http://localhost:5001/createBook`` This API will create a new book.

``http://localhost:5001/getAllBooks`` Get all books without authorization.

``http://localhost:5001/getAllBookByUser`` Get all books with authorization.

``http://localhost:5001/getBookByBookId/:bookId`` This API will retrieve book by bookId and without authorization.

``http://localhost:5001/getBookByBookIdUser/:bookId`` This API will retrieve book by bookId and with user login.

``http://localhost:5001/updateBook/:bookId`` This api update the two fields first ``title`` & second ``summery``.

``http://localhost:5001/deleteBook/:bookId`` This api delete the book by bookId.

## Authentication with JWT Token

## Deployment the application in https://app.cyclic.sh/

``https://busy-teal-slippers.cyclic.app/`` This is the application link
