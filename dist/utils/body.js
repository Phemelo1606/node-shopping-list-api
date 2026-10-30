"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonBody = readJsonBody;
const httpErrors_1 = require("../errors/httpErrors");
function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            if (raw.length === 0) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(raw));
            }
            catch {
                reject(new httpErrors_1.BadRequestError('Request body must be valid JSON'));
            }
        });
        req.on('error', reject);
    });
}
