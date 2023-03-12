import { Component, OnInit } from '@angular/core'
import { MerchService } from './merch.service'
import { OrderDTO } from "../../../server/ts/controller/dto"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'admin'
  orders: OrderDTO[] = []

  constructor(private merchService: MerchService) {}

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.merchService.getOrders().subscribe(orders => { console.log(orders); this.orders = orders})
  }

  trackOrder(index: number, order: OrderDTO) {
    return order.id
  }
}
