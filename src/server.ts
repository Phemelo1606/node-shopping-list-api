import http from 'http';
import { getAllItems, addItem } from './data/itemStore';
import { sendJson } from './utils/response';
import { readJsonBody } from './utils/body';
import { validateNewItem } from './validation/itemValidation';

const PORT = process.env.PORT || 3000;

const server = http.createServer(async(req, res) => {
    const { method, url } = req;


    // GET /items → return all items
  if (url === '/items' && method === 'GET') {
    sendJson(res, 200, { success: true, data: getAllItems() });
    return;
    }


    // POST /items → create a new item
  if (url === '/items' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const { errors, data } = validateNewItem(body);

      if (errors.length > 0 || !data) {
        sendJson(res, 400, {
          success: false,
          error: { message: 'Validation failed', details: errors },
        });
        return;
        }

         const created = addItem(data);
      sendJson(res, 201, { success: true, data: created });
    } catch {
      sendJson(res, 400, {
        success: false,
        error: { message: 'Request body must be valid JSON' },
      });
    }
    return;
    }

     // Anything else
  sendJson(res, 404, { success: false, error: { message: 'Route not found' } });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});