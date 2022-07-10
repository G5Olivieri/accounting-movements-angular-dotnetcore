import {Component, OnInit} from '@angular/core';
import {MovementStatus, MovementType} from "../movement";
import {Location} from "@angular/common";
import {MovementsService} from "../movements.service";

@Component({
  selector: 'app-new-movement',
  templateUrl: './new-movement.component.html',
  styleUrls: ['./new-movement.component.scss']
})
export class NewMovementComponent implements OnInit {
  movement = {
    name: '',
    description: '',
    amount: '',
    repeat: false,
    splitsOfAmount: '',
    date: new Date().toISOString().split('T')[0],
    type: MovementType.expense.toString(),
    status: MovementStatus.pending,
  }

  constructor(private location: Location, private service: MovementsService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.service.create({
      name: this.movement.name,
      description: this.movement.description,
      date: new Date(this.movement.date),
      type: parseInt(this.movement.type, 10) as MovementType,
      amount: parseInt(this.movement.amount, 10),
      status: this.movement.status,
      repeat: this.movement.repeat,
      splitsOfAmount: parseInt(this.movement.splitsOfAmount || '0', 10),
    }).subscribe(() => {
      this.location.back()
    })
  }
}
