import { Component } from '@angular/core';
import { SharedDataServiceService } from '../shared-data-service.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage {

  constructor(private _modelService: SharedDataServiceService) { }

  Name = '';
  Quantity = '';
  Price = '';

  async save() {
    if (this.Name.length <= 0) {
      await this._modelService.popup('Creation Error', '\nNew items must have a unique name.', 'Oops');
      return;
    }
    this.Name = this.Name.substring(0,1).toUpperCase() + this.Name.substring(1);
    let quantity = parseInt(this.Quantity);
    if (this.Quantity == '') {
      await this._modelService.popup('Creation Error', '\nNew items must have an intially stocked quantity.', 'Oops');
      return;
    }
    let price = parseFloat(this.Price);
    console.log(price);
    if (!(price >= 0 || price < 0)) {
      await this._modelService.popup('Creation Error', '\nNew items must have an initial price.', 'Oops');
      return;
    }
    if (price < 0) {
      await this._modelService.popup('Creation Error', '\nNew items cannot have a negative price.', 'Oops');
      return;
    }
    if (price == 0)
      await this._modelService.popup('Warning', '\nNew item will be classified as FREE.', 'Okay');

    let result = this._modelService.createItem({ name: this.Name, quantity: quantity, price: price });
    if (result) {
      if (result.message.startsWith('ERROR:\n')) {
        await this._modelService.popup('Creation Error', result.message.replace('ERROR:',''), 'Oops');
        return;
      }
      await this._modelService.popup('Warning', result.message.replace('WARNING:',''), 'Okay');
    }
    await this._modelService.popup('Success!', 'Successfully created new product ' + this.Name + ' and added it to the store.', '5000');
  }

}
