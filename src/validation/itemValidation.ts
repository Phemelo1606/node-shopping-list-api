import { NewItemData, ItemChanges } from '../models/item';

interface ValidationResult<T> {
  errors: string[];
  data?: T;
}

// Turns the raw body into an object, or returns null if it isn't one
function toObject(body: unknown): Record<string, unknown> | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return null;
  }
  return body as Record<string, unknown>;
}

// The rules for each field, written once.
// A field that is not present is skipped here (required-ness is checked separately).
function checkFields(obj: Record<string, unknown>): string[] {
  const { name, quantity, purchased } = obj;
  const errors: string[] = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push('name must be a non-empty string');
  }

  if (quantity !== undefined && (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1)) {
    errors.push('quantity must be a whole number of 1 or more');
  }

  if (purchased !== undefined && typeof purchased !== 'boolean') {
    errors.push('purchased must be true or false');
  }

  return errors;
}

// POST: name is required, quantity and purchased get defaults
export function validateNewItem(body: unknown): ValidationResult<NewItemData> {
  const obj = toObject(body);
  if (!obj) {
    return { errors: ['Request body must be a JSON object'] };
  }

  const errors = checkFields(obj);
  if (obj.name === undefined) {
    errors.push('name is required');
  }
  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    data: {
      name: (obj.name as string).trim(),
      quantity: (obj.quantity as number | undefined) ?? 1,
      purchased: (obj.purchased as boolean | undefined) ?? false,
    },
  };
}

// PUT: every field is optional, but at least one must be sent
export function validateItemUpdate(body: unknown): ValidationResult<ItemChanges> {
  const obj = toObject(body);
  if (!obj) {
    return { errors: ['Request body must be a JSON object'] };
  }

  const errors = checkFields(obj);
  if (errors.length > 0) {
    return { errors };
  }

  const changes: ItemChanges = {};
  if (obj.name !== undefined) changes.name = (obj.name as string).trim();
  if (obj.quantity !== undefined) changes.quantity = obj.quantity as number;
  if (obj.purchased !== undefined) changes.purchased = obj.purchased as boolean;

  if (Object.keys(changes).length === 0) {
    return { errors: ['Provide at least one of: name, quantity, purchased'] };
  }

  return { errors, data: changes };
}