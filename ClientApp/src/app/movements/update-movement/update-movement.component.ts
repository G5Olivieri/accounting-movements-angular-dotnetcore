import {Component, OnInit} from '@angular/core';
import {Observable, of, zip} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {MovementsService} from "../movements.service";
import {Movement, MovementStatus, MovementType} from "../movement";
import {format, parseISO} from "date-fns";
import {MatDialog} from "@angular/material/dialog";
import {OnlyThisDialogComponent} from "../only-this-dialog/only-this-dialog.component";

type MovementForm = {
  id: string
  name: string
  date: string
  amount: string
  type: string
  status: string
  description: string
  permanentCorrelationID: string | null
  userID: string
  virtual: boolean
}

@Component({
  selector: 'app-update-movement',
  templateUrl: './update-movement.component.html',
  styleUrls: ['./update-movement.component.scss']
})
export class UpdateMovementComponent implements OnInit {
  movement$: Observable<MovementForm | null> = of(null)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MovementsService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.movement$ = zip(this.route.queryParamMap, this.route.paramMap)
      .pipe(
        switchMap(([queryParams, params]) => {
          return this.service.getById(params.get('id'), queryParams.get('virtual'), queryParams.get('date'))
        }),
        map<Movement | null, MovementForm | null>(movement => {
          if (movement === null) return null;
          return {
            id: movement.id,
            name: movement.name,
            date: format(movement.date, 'yyyy-MM-dd'),
            amount: movement.amount.toString(),
            type: movement.type.toString(),
            status: movement.status.toString(),
            description: movement.description,
            userID: movement.userID,
            permanentCorrelationID: movement.permanentCorrelationID,
            virtual: movement.virtual,
          }
        })
      )
  }

  onSubmit(movement: MovementForm) {
    if (movement.permanentCorrelationID) {
      const dialogRef = this.dialog.open(OnlyThisDialogComponent, {
        data: {
          name: movement.name
        },
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result === undefined) {
          return
        }
        if (result === '0') {
          this.update(movement, true);
          return
        }
        this.update(movement, false);
      })
      return
    }
    this.update(movement, true)
  }

  private update(movement: MovementForm, onlyThisOne: boolean) {
    this.service.update({
      id: movement.id,
      name: movement.name,
      amount: parseInt(movement.amount, 10),
      description: movement.description,
      date: parseISO(movement.date),
      type: movement.type === '0' ? MovementType.expense : MovementType.income,
      status: movement.status as MovementStatus,
      permanentCorrelationID: movement.permanentCorrelationID,
      virtual: movement.virtual,
      userID: movement.userID,
      end: null
    }, onlyThisOne).subscribe(() => {
      this.router.navigate(['..'], {relativeTo: this.route})
    })
  }
}
