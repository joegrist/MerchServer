import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../server/ts/controller/dto';

@Injectable({
  providedIn: 'root'
})
export class MerchService implements OnInit {

  private ordersUrl = 'http://merch.zapto.org:3333/admin/orders';  // URL to web api
  orders: OrderDTO[] = []

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log("y")
    this.getOrders().subscribe(orders => { console.log(orders); this.orders = orders})    
  }

  /** GET orders from the server */
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl)
  }

}
