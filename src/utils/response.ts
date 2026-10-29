import { ServerResponse } from 'http';

export function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

export function sendError(
    res: ServerResponse,
    statusCode: number,
    message: string,
    details?: string[]
): void {
    sendJson(res, statusCode, {
        succed: false,
        error: details ? { message, details } : {message}
    })
}