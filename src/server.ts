import http, { IncomingMessage, ServerResponse } from 'http';
import { getAllItems, getItemById, addItem, updateItem, deleteItem } from './data/itemStore';
import { Item } from './models/item';
import { BadRequestError, NotFoundError, MethodNotAllowedError } from './errors/httpErrors';
import { handleError } from './utils/errorHandler';
import { sendSuccess, sendNoContent } from './utils/response';
import { readJsonBody } from './utils/body';
import { validateNewItem, validateItemUpdate, ValidationResult } from './validation/itemValidation';

const PORT = process.env.PORT || 3000;

// Helpers

// Accepts only whole numbers like "5". Rejects "abc", "-1", "1.5".
function parseId(raw: string): number {
  if (!/^\d+$/.test(raw)) {
    throw new BadRequestError('Item id must be a whole number');
  }
  return Number(raw);
}

function findItemOrThrow(id: number): Item {
  const item = getItemById(id);
  if (!item) {
    throw new NotFoundError(`Item with id ${id} not found`);
  }
  return item;
}

// Returns the validated data, or throws a 400 with the list of problems
function assertValid<T>(result: ValidationResult<T>): T {
  if (result.errors.length > 0 || !result.data) {
    throw new BadRequestError('Validation failed', result.errors);
  }
  return result.data;
}

// Handlers: one per endpoint

function handleGetAll(res: ServerResponse): void {
  sendSuccess(res, 200, getAllItems());
}

async function handleCreate(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readJsonBody(req);
  const data = assertValid(validateNewItem(body));
  sendSuccess(res, 201, addItem(data));
}

function handleGetOne(res: ServerResponse, id: number): void {
  sendSuccess(res, 200, findItemOrThrow(id));
}

async function handleUpdate(req: IncomingMessage, res: ServerResponse, id: number): Promise<void> {
  findItemOrThrow(id); // 404 first, if it doesn't exist
  const body = await readJsonBody(req);
  const changes = assertValid(validateItemUpdate(body));
  sendSuccess(res, 200, updateItem(id, changes));
}

function handleDelete(res: ServerResponse, id: number): void {
  findItemOrThrow(id); // 404 if it doesn't exist
  deleteItem(id);
  sendNoContent(res);
}

// Router

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const method = req.method ?? 'GET';
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  const parts = pathname.split('/').filter(Boolean); // '/items/5' -> ['items', '5']

  // Only /items and /items/:id exist
  if (parts[0] !== 'items' || parts.length > 2) {
    throw new NotFoundError('Route not found');
  }

  // /items
  if (parts.length === 1) {
    if (method === 'GET') return handleGetAll(res);
    if (method === 'POST') return handleCreate(req, res);
    throw new MethodNotAllowedError(method, '/items');
  }

  // /items/:id
  const id = parseId(parts[1]);
  if (method === 'GET') return handleGetOne(res, id);
  if (method === 'PUT') return handleUpdate(req, res, id);
  if (method === 'DELETE') return handleDelete(res, id);
  throw new MethodNotAllowedError(method, '/items/:id');
}

const server = http.createServer(async (req, res) => {
  try {
    await route(req, res);
  } catch (error) {
    handleError(res, error); // the ONE place every error ends up
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

