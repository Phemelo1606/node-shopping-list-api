"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodNotAllowedError = exports.NotFoundError = exports.BadRequestError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message, details) {
        super(400, message, details);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends HttpError {
    constructor(message) {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class MethodNotAllowedError extends HttpError {
    constructor(method, path) {
        super(405, `Method ${method} is not allowed on ${path}`);
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
