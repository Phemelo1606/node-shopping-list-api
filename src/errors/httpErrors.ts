export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: string[]
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: string[]) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(method: string, path: string) {
    super(405, `Method ${method} is not allowed on ${path}`);
  }
}