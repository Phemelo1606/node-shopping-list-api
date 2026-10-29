"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.sendNoContent = sendNoContent;
function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}
function sendSuccess(res, statusCode, data) {
    const body = { success: true, data };
    sendJson(res, statusCode, body);
}
function sendError(res, statusCode, message, details) {
    const body = {
        success: false,
        error: details ? { message, details } : { message },
    };
    sendJson(res, statusCode, body);
}
// 204 No Content: the one response with no JSON body
function sendNoContent(res) {
    res.writeHead(204);
    res.end();
}
