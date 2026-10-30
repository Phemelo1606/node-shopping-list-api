import { ServerResponse } from 'http';
import { SuccessResponse, ErrorResponse } from '../types/api';

function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: SuccessResponse<unknown> | ErrorResponse
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function sendSuccess<T>(res: ServerResponse, statusCode: number, data: T): void {
  const body: SuccessResponse<T> = { success: true, data };
  sendJson(res, statusCode, body);
}

export function sendError(
  res: ServerResponse,
  statusCode: number,
  message: string,
  details?: string[]
): void {
  const body: ErrorResponse = {
    success: false,
    error: details ? { message, details } : { message },
  };
  sendJson(res, statusCode, body);
}

// 204 No Content: the one response with no JSON body
export function sendNoContent(res: ServerResponse): void {
  res.writeHead(204);
  res.end();
}