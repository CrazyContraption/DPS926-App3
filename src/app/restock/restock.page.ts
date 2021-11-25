import { Component, AfterViewChecked } from '@angular/core';
import { SharedDataServiceService } from '../shared-data-service.service';

@Component({
  selector: 'app-restock',
  templateUrl: './restock.page.html',
  styleUrls: ['./restock.page.scss'],
})
export class RestockPage implements AfterViewChecked {

  constructor(private _modelService: SharedDataServiceService) { }

  ngAfterViewChecked() {
    this.Items = this._modelService.getItems();
  }
  
  Items = [];
  Quantity = '';

  private Index = -1;

  async restock() {
    let quantity = parseInt(this.Quantity);
    if (this.Index < 0) {
      await this._modelService.popup('Restock Error', '\nYou must select an item to restock from the list prior to restocking.', 'Oops');
      return;
    }
    if (quantity == 0 || !quantity) {
      await this._modelService.popup('Restock Error', '\nIt\'s kinda pointless to restock nothing, isn\'t it?', 'Oops');
      return;
    }
    let result = this._modelService.restockItem(this.Items[this.Index].name, quantity);
    if (result)
      await this._modelService.popup('Warning', result.message.replace('ERROR:','').replace('WARNING:',''), 'Okay');
    await this._modelService.popup('Success!', 'Successfully ' + (quantity > 0 ? 'restocked' : 'deducted') + ' ' + Math.abs(quantity) + ' ' + this.Items[this.Index].name + (quantity > 0 ? ' to' : ' from') + ' the store inventory.', '5000');
  }

  itemSelected(index: number) {
    let listElements = document.querySelectorAll("ion-item.restock-list");
    listElements.forEach(item => {
      item.classList.remove("selected");
    });
    listElements[index].classList.add("selected");
    this.Index = index;
  }
}