import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../server/ts/controller/dto';

@Injectable({
  providedIn: 'root'
})
export class MerchService implements OnInit {

  private base = 'http://merch.zapto.org:3333/admin/'
  private ordersUrl = `${this.base}orders`
  private fulfilUrl = `${this.base}fulfil`
  orders: OrderDTO[] = []

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetch()   
  }

  fetch() {
    this.getOrders().subscribe(orders => { this.orders = orders}) 
  }

  /** GET orders from the server */
  getOrders(): Observable<any[]> {
    return this.http.get<OrderDTO[]>(this.ordersUrl)
  }

  setFulfilment(to: boolean, orders: string[]) {
    this.http.get<boolean>(this.fulfilUrl).subscribe(completed => this.fetch())
  }
}
