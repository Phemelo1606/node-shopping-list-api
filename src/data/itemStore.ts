import { Item, ItemChanges, NewItemData } from '../models/item';

const items: Item[] = [];
let nextId = 1;

export function getAllItems(): Item[] {
    return items
}

export function getItemById(id: number): Item | undefined {
    return items.find((item) => item.id === id);
}

export function addItem( data: NewItemData): Item {
    const newItem: Item = { id: nextId++, ...data };
    items.push(newItem);
    return newItem;
}

export function updateItem(id: number, changes: ItemChanges): Item | undefined {
    const item = getItemById(id);
    if (!item) {
        return undefined;
    }
    Object.assign(item, changes);
    return item;
}