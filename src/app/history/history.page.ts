import { Component, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataServiceService } from '../shared-data-service.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements AfterViewChecked {
  
  constructor(private _modelService: SharedDataServiceService, private router: Router) { }

  ngAfterViewChecked() {
    this.Purchases = this._modelService.getHistory();
  }
  
  Purchases = [];
  Quantity = '';

  purchaseSelected(index: number) {
    let listElements = document.querySelectorAll("ion-item.history-list");
    listElements.forEach(item => {
      item.classList.remove("selected");
    });
    listElements[index].classList.add("selected");
    this.router.navigateByUrl('/manager/history/' + index);
  }
}