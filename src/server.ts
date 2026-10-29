import http, { IncomingMessage, ServerResponse} from 'http';
import { getAllItems, addItem, getItemById, updateItem } from './data/itemStore';
import { sendJson, sendError} from './utils/response';
import { readJsonBody } from './utils/body';
import { validateNewItem, validateItemUpdate} from './validation/itemValidation';

const PORT = process.env.PORT || 3000;

// Accepts only whole numbers like "5". Rejects "abc", "-1", "1.5".
function parseId(raw: string): number | null {
    return /^\d+$/.test(raw) ? Number(raw) : null;
}

// Reads the JSON body. If it's broken, replies with 400 and returns undefined.
async function readBodyOrRejection(req: IncomingMessage, res: ServerResponse): Promise<unknown> {
    try {
        return await readJsonBody(req);
    } catch {
        sendError(res, 400, 'Request body must be valid JSON');
        return undefined;
    }
}

//Handlers- one per endpoint

function handleGetAll(res: ServerResponse): void {
    sendJson(res, 200, { success: true, data: getAllItems() });
}

async function handleCreate(req:IncomingMessage, res: ServerResponse): Promise<void> {
    const body = await readBodyOrRejection(req, res);
    if (body === undefined) return;

    const  { errors, data } = validateNewItem(body);
  if (errors.length > 0 || !data) {
    return sendError(res, 400, 'Validation failed', errors);
  }

  sendJson(res, 201, { success: true, data: addItem(data) });
}

function handleGetOne(res: ServerResponse, id: number): void {
  const item = getItemById(id);
  if (!item) {
    return sendError(res, 404, `Item with id ${id} not found`);
  }
  sendJson(res, 200, { success: true, data: item });
}

async function handleUpdate(req: IncomingMessage, res: ServerResponse, id: number): Promise<void> {
  // 1. Does the item exist?
  if (!getItemById(id)) {
    return sendError(res, 404, `Item with id ${id} not found`);
  }

  // 2. Is the body valid?
  const body = await readBodyOrRejection(req, res);
  if (body === undefined) return;

  const { errors, data } = validateItemUpdate(body);
  if (errors.length > 0 || !data) {
    return sendError(res, 400, 'Validation failed', errors);
  }

  // 3. Apply the changes
  sendJson(res, 200, { success: true, data: updateItem(id, data) });
}

//Router

const server = http.createServer(async(req, res) => {
      try {
    const method = req.method ?? 'GET';
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    const parts = pathname.split('/').filter(Boolean); // '/items/5' -> ['items', '5']

    // Only /items and /items/:id exist
    if (parts[0] !== 'items' || parts.length > 2) {
      return sendError(res, 404, 'Route not found');
    }

    // /items
    if (parts.length === 1) {
      if (method === 'GET') return handleGetAll(res);
      if (method === 'POST') return await handleCreate(req, res);
      return sendError(res, 405, `Method ${method} is not allowed on /items`);
    }

    // /items/:id
    const id = parseId(parts[1]);
    if (id === null) {
      return sendError(res, 400, 'Item id must be a whole number');
    }

    if (method === 'GET') return handleGetOne(res, id);
    if (method === 'PUT') return await handleUpdate(req, res, id);
    return sendError(res, 405, `Method ${method} is not allowed on /items/:id`);
  } catch (error) {
    console.error('Unexpected error:', error);
    sendError(res, 500, 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});