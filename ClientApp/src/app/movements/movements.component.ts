import {Component, OnInit} from '@angular/core';
import {Movement, MovementStatus} from "./movement";
import {format} from "date-fns";
import {MovementsService} from "./movements.service";
import {MatDialog} from "@angular/material/dialog";
import {OnlyThisDialogComponent} from "./only-this-dialog/only-this-dialog.component";

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit {
  movements: Movement[] = []
  month = format(new Date(), 'yyyy-MM')

  constructor(
    private service: MovementsService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.updateList()
  }

  onMonthChange(event: string) {
    this.month = event
    this.updateList()
  }

  private updateList() {
    this.service.list(this.month).subscribe(movements => {
      this.movements = movements.filter(m => m.status !== MovementStatus.deleted)
    })
  }

  public deleteMovement(movement: Movement) {
    if (movement.virtual) {
      const dialogRef = this.dialog.open(OnlyThisDialogComponent, {
        data: {
          name: movement.name
        }
      })
      dialogRef.afterClosed().subscribe((value) => {
        if (value === undefined) {
          return
        }
        if (value === '0') {
          this.service.delete(movement, true).subscribe(() => {
            this.updateList()
          })
          return
        }
        this.service.delete(movement, false, this.month).subscribe(() => {
          this.updateList()
        })
      })
      return
    }
    this.service.delete(movement, true).subscribe(() => {
      this.updateList()
    })
  }

  public pay(movement: Movement) {
    this.service.pay(movement).subscribe(() => {
      movement.status = MovementStatus.done
    })
  }
}

