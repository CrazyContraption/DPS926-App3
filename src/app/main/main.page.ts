import { Component, AfterViewChecked } from '@angular/core';
import { SharedDataServiceService } from '../shared-data-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewChecked {

  constructor(private _modelService: SharedDataServiceService) { }

  ngAfterViewChecked() {
    this.Items = this._modelService.getItems();
  }

  Type = "None";
  Quantity = "0";
  Total = 0.0;
  Items = [];

  private Index = 0;

  async keypadEntry(entry: string = "") {
    entry = entry.toLowerCase();
    switch (entry) {
      case 'buy':
        let quantity = parseInt(this.Quantity);
        if (this.Type == "None") {
          await this._modelService.popup('Purchase Error', '\nYou must select an item to purchase from the list prior to purchasing.', 'Oops');
          break;
        }
        if (quantity == 0) {
          await this._modelService.popup('Purchase Error', '\nYou must select a quantity above 0 for a purchase to be considered valid.', 'Oops');
          break;
        }
        if (quantity > this.Items[this.Index].quantity) {
          await this._modelService.popup('Purchase Error', '\nYou must select a quantity below ' + this.Items[this.Index].quantity + ' due to limited stock.', 'Oops');
          break;
        }
        let result = this._modelService.restockItem(this.Type, quantity * -1);
        if (result)
          await this._modelService.popup('Warning', result.message.replace('ERROR:','').replace('WARNING:',''), 'Okay');
        result = this._modelService.createPurchase({name: this.Type, quantity: quantity, price: this.Total, date: Date.now()});
        if (result)
          await this._modelService.popup('Warning', result.message.replace('ERROR:','').replace('WARNING:',''), 'Okay');
        await this._modelService.popup('Success!', '\n' + quantity + ' "' + this.Type + '" were puchased successfully, for a total of $' + this.Total.toFixed(2) +'.\n\nPurchase recorded to history.', 'Okay');

        this.Quantity = '0';
        this.Total = 0;

        this.updatePricing();
        break;
      
      case 'del':
        if (this.Quantity.length > 1)
          this.Quantity = this.Quantity.substring(0, this.Quantity.length - 1);
        else
          this.Quantity = '0';
        this.updatePricing();
        break;
    
      default:
        let num = parseInt(entry);
        if (this.Quantity != '0')
          this.Quantity += num.toString();
        else
          this.Quantity = num.toString();
        this.updatePricing();
        break;
    }
  }

  itemSelected(index: number) {
    let listElements = document.querySelectorAll("ion-item.main");
    listElements.forEach(item => {
      item.classList.remove("selected");
    });
    listElements[index].classList.add("selected");
    this.Index = index;
    this.Type = this.Items[index].name;
    this.updatePricing();
  }

  private updatePricing() {
    this.Total = this.Items[this.Index].price * parseInt(this.Quantity);
  }
}