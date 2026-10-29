"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const itemStore_1 = require("./data/itemStore");
const httpErrors_1 = require("./errors/httpErrors");
const errorHandler_1 = require("./utils/errorHandler");
const response_1 = require("./utils/response");
const body_1 = require("./utils/body");
const itemValidation_1 = require("./validation/itemValidation");
const PORT = process.env.PORT || 3000;
// Helpers
// Accepts only whole numbers like "5". Rejects "abc", "-1", "1.5".
function parseId(raw) {
    if (!/^\d+$/.test(raw)) {
        throw new httpErrors_1.BadRequestError('Item id must be a whole number');
    }
    return Number(raw);
}
function findItemOrThrow(id) {
    const item = (0, itemStore_1.getItemById)(id);
    if (!item) {
        throw new httpErrors_1.NotFoundError(`Item with id ${id} not found`);
    }
    return item;
}
// Returns the validated data, or throws a 400 with the list of problems
function assertValid(result) {
    if (result.errors.length > 0 || !result.data) {
        throw new httpErrors_1.BadRequestError('Validation failed', result.errors);
    }
    return result.data;
}
// Handlers: one per endpoint
function handleGetAll(res) {
    (0, response_1.sendSuccess)(res, 200, (0, itemStore_1.getAllItems)());
}
async function handleCreate(req, res) {
    const body = await (0, body_1.readJsonBody)(req);
    const data = assertValid((0, itemValidation_1.validateNewItem)(body));
    (0, response_1.sendSuccess)(res, 201, (0, itemStore_1.addItem)(data));
}
function handleGetOne(res, id) {
    (0, response_1.sendSuccess)(res, 200, findItemOrThrow(id));
}
async function handleUpdate(req, res, id) {
    findItemOrThrow(id); // 404 first, if it doesn't exist
    const body = await (0, body_1.readJsonBody)(req);
    const changes = assertValid((0, itemValidation_1.validateItemUpdate)(body));
    (0, response_1.sendSuccess)(res, 200, (0, itemStore_1.updateItem)(id, changes));
}
function handleDelete(res, id) {
    findItemOrThrow(id); // 404 if it doesn't exist
    (0, itemStore_1.deleteItem)(id);
    (0, response_1.sendNoContent)(res);
}
// Router
async function route(req, res) {
    const method = req.method ?? 'GET';
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    const parts = pathname.split('/').filter(Boolean); // '/items/5' -> ['items', '5']
    // Only /items and /items/:id exist
    if (parts[0] !== 'items' || parts.length > 2) {
        throw new httpErrors_1.NotFoundError('Route not found');
    }
    // /items
    if (parts.length === 1) {
        if (method === 'GET')
            return handleGetAll(res);
        if (method === 'POST')
            return handleCreate(req, res);
        throw new httpErrors_1.MethodNotAllowedError(method, '/items');
    }
    // /items/:id
    const id = parseId(parts[1]);
    if (method === 'GET')
        return handleGetOne(res, id);
    if (method === 'PUT')
        return handleUpdate(req, res, id);
    if (method === 'DELETE')
        return handleDelete(res, id);
    throw new httpErrors_1.MethodNotAllowedError(method, '/items/:id');
}
const server = http_1.default.createServer(async (req, res) => {
    try {
        await route(req, res);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, error); // the ONE place every error ends up
    }
});
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
