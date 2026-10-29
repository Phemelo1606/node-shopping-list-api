"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewItem = validateNewItem;
exports.validateItemUpdate = validateItemUpdate;
// Turns the raw body into an object, or returns null if it isn't one
function toObject(body) {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return null;
    }
    return body;
}
// The rules for each field, written once.
// A field that is not present is skipped here (required-ness is checked separately).
function checkFields(obj) {
    const { name, quantity, purchased } = obj;
    const errors = [];
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
function validateNewItem(body) {
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
            name: obj.name.trim(),
            quantity: obj.quantity ?? 1,
            purchased: obj.purchased ?? false,
        },
    };
}
// PUT: every field is optional, but at least one must be sent
function validateItemUpdate(body) {
    const obj = toObject(body);
    if (!obj) {
        return { errors: ['Request body must be a JSON object'] };
    }
    const errors = checkFields(obj);
    if (errors.length > 0) {
        return { errors };
    }
    const changes = {};
    if (obj.name !== undefined)
        changes.name = obj.name.trim();
    if (obj.quantity !== undefined)
        changes.quantity = obj.quantity;
    if (obj.purchased !== undefined)
        changes.purchased = obj.purchased;
    if (Object.keys(changes).length === 0) {
        return { errors: ['Provide at least one of: name, quantity, purchased'] };
    }
    return { errors, data: changes };
}
