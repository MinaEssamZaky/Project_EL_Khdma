/*
This class is used to create custom error objects that can be thrown in the application.
It extends the built-in Error class and adds a statusCode property to indicate the HTTP status code of the error.
It also has an isOperational property to indicate whether the error is operational or not.
This is useful for distinguishing between operational errors (like validation errors) and programming errors (like syntax errors).
The constructor takes two arguments: message and statusCode. The message is passed to the parent Error class, and the statusCode is assigned to the statusCode property of the instance.
The isOperational property is set to true by default, indicating that this is an operational error.
*/ 
export class AppError extends Error {
constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
}}