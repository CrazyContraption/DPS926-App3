import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { IPurchase, SharedDataServiceService } from '../shared-data-service.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {
  
  constructor(private _modelService: SharedDataServiceService, private location: Location, private activatedRoute: ActivatedRoute) { }
  
  Purchase : IPurchase;

  ngOnInit() {
    let index = parseInt(this.activatedRoute.snapshot.paramMap.get('index'));
    if (index >= 0) {
      let result = this._modelService.getPurchase(index);
      if (result instanceof Error) {
        this._modelService.popup('ERROR', result.message.replace('ERROR:','').replace('WARNING:',''), 'Oops');
        this.location.back();
      } else
        this.Purchase = result;
    }
  }
}