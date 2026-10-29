import { IncomingMessage } from 'http';
import { BadRequestError } from '../errors/httpErrors';

export function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk: Buffer) => {
      raw += chunk;
    });

    req.on('end', () => {
      if (raw.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new BadRequestError('Request body must be valid JSON'));
      }
    });

    req.on('error', reject);
  });
}