import { Item } from '../models/item';

const items: Item[] = [];
let nextId = 1;

export function getAllItems(): Item[] {
    return items
}

export function addItem(data: { name: string; quantity: number; purchased: boolean }): Item {
    const newItem: Item = { id: nextId++, ...data };
    items.push(newItem);
    return newItem;
}