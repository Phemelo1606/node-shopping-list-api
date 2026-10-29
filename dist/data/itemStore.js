"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = getAllItems;
exports.getItemById = getItemById;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
const items = [];
let nextId = 1;
function getAllItems() {
    return items;
}
function getItemById(id) {
    return items.find((item) => item.id === id);
}
function addItem(data) {
    const newItem = { id: nextId++, ...data };
    items.push(newItem);
    return newItem;
}
function updateItem(id, changes) {
    const item = getItemById(id);
    if (!item) {
        return undefined;
    }
    Object.assign(item, changes);
    return item;
}
function deleteItem(id) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    items.splice(index, 1);
    return true;
}
