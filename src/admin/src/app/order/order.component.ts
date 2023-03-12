import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderDTO } from '../../../../server/ts/controller/dto';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {

  @Input() order!: OrderDTO

  checkChange() {
    this.order.checked = !this.order.checked
  }
}
