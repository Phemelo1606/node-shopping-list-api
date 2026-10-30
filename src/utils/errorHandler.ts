import { ServerResponse } from 'http';
import { HttpError } from '../errors/httpErrors';
import { sendError } from './response';

export function handleError(res: ServerResponse, error: unknown): void {
  // If a response was already started, we can't send another one
  if (res.headersSent) {
    res.end();
    return;
  }

  // Errors we threw on purpose: 400, 404, 405 ...
  if (error instanceof HttpError) {
    sendError(res, error.statusCode, error.message, error.details);
    return;
  }

  // Anything else is a bug. Log the details, but don't leak them to the client.
  console.error('Unexpected error:', error);
  sendError(res, 500, 'Internal server error');
}