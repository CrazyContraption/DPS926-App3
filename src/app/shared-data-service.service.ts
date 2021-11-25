import { Injectable } from '@angular/core';
import { toastController } from '@ionic/core';

export interface IItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IPurchase extends IItem {
  date: number;
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataServiceService {

  constructor() {
    this._items.push({ name: "Pants", quantity: 20, price: 50.70 });
    this._items.push({ name: "Shoes", quantity: 50, price: 90.00 });
    this._items.push({ name: "Hats", quantity: 10, price: 20.50 });
    this._items.push({ name: "T-Shirts", quantity: 20, price: 42.50 });
    this._items.push({ name: "Dresses", quantity: 24, price: 71.20 });
    this._items.push({ name: "Socks", quantity: 50, price: 12.50 });
  }

  private _items:IItem[] = [];
  private _history:IPurchase[] = [];

  createItem(item: IItem): Error | undefined {
    for (let index = 0; index < this._items.length; index++) {
      if (this._items[index].name == item.name) {
        return new Error("ERROR:\nItem '" + item.name.replace('"','') + "' already exists! Please select a different name.");
      }
    }
    if (item.price < 0)
      return new Error("ERROR:\nPrice of '" + item.name.replace('"','') + "' is negative. Please enter a value of $0.00 or higher.");
    this._items.push(item);
    if (item.quantity < 0)
      return new Error("WARNING:\nStock of '" + item.name.replace('"','') + "' is now negative, reflecting that stock is owed. Please get a manager to restock/reorder this product soon.");
    return;
  }

  getItems(): IItem[] | undefined {
      return this._items;
  }

  restockItem(itemName: string, quantityToAdd: number): Error | undefined {
    for (let index = 0; index < this._items.length; index++) {
      if (this._items[index].name == itemName) {
        this._items[index].quantity += Math.floor(quantityToAdd);
        if (this._items[index].quantity < 0)
          return new Error("WARNING:\nStock of '" + itemName.replace('"','') + "' is now negative, reflecting that stock is owed. Please get a manager to restock/reorder this product soon.");
        return;
      }
      
    }
    return new Error("ERROR:\nNo item named '" + itemName.replace('"','') + "' found! Please select a valid item.");
  }

  createPurchase(purchase: IPurchase): Error | undefined {
    this._history.push(purchase);
    return;
  }

  getHistory(): IPurchase[] | undefined {
    return this._history;
  }

  getPurchase(index: number): IPurchase | Error {
    if (index < 0 || index >= this._history.length)
      return new Error("ERROR:\nNo item with index " + index + " was found.");
    return this._history[index];
}

  async popup(heading: string, body: string, button?: string) {
    let time = parseInt(button);
    if (button && !time) {
      const toast = await toastController.create({
        header: heading,
        message: body,
        color: 'dark',
        buttons: [button],
        position: 'middle'
      });
      await toast.present();
    }
    else {
      const toast = await toastController.create({
        header: heading,
        message: body,
        color: 'dark',
        duration: (time ?? 3000)
      });
      await toast.present();
    }
  }
}