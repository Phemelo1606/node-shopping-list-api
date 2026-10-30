"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const httpErrors_1 = require("../errors/httpErrors");
const response_1 = require("./response");
function handleError(res, error) {
    // If a response was already started, we can't send another one
    if (res.headersSent) {
        res.end();
        return;
    }
    // Errors we threw on purpose: 400, 404, 405 ...
    if (error instanceof httpErrors_1.HttpError) {
        (0, response_1.sendError)(res, error.statusCode, error.message, error.details);
        return;
    }
    // Anything else is a bug. Log the details, but don't leak them to the client.
    console.error('Unexpected error:', error);
    (0, response_1.sendError)(res, 500, 'Internal server error');
}
