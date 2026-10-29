export interface Item {
    id: number;
    name: string;
    quantity: number;
    purchased: boolean;
}


//Everything excepts the id
export type NewItemData = Omit<Item, 'id'>;

//Any subnet of those fields
export type ItemChanges = Partial<NewItemData>;