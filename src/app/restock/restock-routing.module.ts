import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestockPage } from './restock.page';

const routes: Routes = [
  {
    path: '',
    component: RestockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestockPageRoutingModule {}
