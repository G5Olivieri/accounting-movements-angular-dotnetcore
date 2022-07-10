import {Injectable} from '@angular/core';
import {Movement, MovementStatus, MovementType} from "./movement";
import {Observable, of, zip} from "rxjs";
import {switchMap, map, tap, catchError} from "rxjs/operators";
import {addMonths, format, parseISO, setMonth, subMonths} from "date-fns";
import {MovementsRepository} from "./repositories/movements-repository";
import {PermanentMovementsRepository, PermanentMovementToSave} from "./repositories/permanent-movements-repository";
import partition from 'lodash.partition';

export interface CreateMovement {
  date: Date;
  amount: number;
  repeat: boolean;
  name: string;
  splitsOfAmount: number;
  description: string;
  type: MovementType;
  status: MovementStatus;
}

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  public constructor(
    private movementsRepository: MovementsRepository,
    private permanentMovementsRepository: PermanentMovementsRepository,
  ) {
  }

  public create(create: CreateMovement): Observable<void> {
    if (create.splitsOfAmount) {
      const movementsToSave: Observable<unknown>[] = []
      for (let i = 0; i < create.splitsOfAmount; i++) {
        movementsToSave.push(this.movementsRepository.save(this.getMovementToSave({
          ...create,
          name: `${create.name} - ${i + 1}/${create.splitsOfAmount}`,
          date: addMonths(create.date, i),
        })))
      }
      return zip(...movementsToSave) as unknown as Observable<void>
    }
    if (create.repeat) {
      return this.permanentMovementsRepository.save({
        name: create.name,
        description: create.description,
        amount: create.amount,
        start: create.date,
        end: null,
        type: create.type,
        userID: '',
      }) as unknown as Observable<void>
    }
    return this.movementsRepository.save(this.getMovementToSave(create)) as unknown as Observable<void>
  }

  public list(month: string): Observable<Movement[]> {
    const movements$: Observable<Movement[]> = this.movementsRepository.listAll().pipe(
      map(ms => ms
        .filter(m => format(m.date, 'yyyy-MM') === month)
        .map(m => ({
          id: m.id,
          name: m.name,
          amount: m.amount,
          description: m.description,
          date: m.date,
          type: m.type,
          status: m.status,
          permanentCorrelationID: m.permanentCorrelationID,
          userID: m.userID,
          virtual: false,
          end: null
        }))))
    const permanentMovements$: Observable<Movement[]> = this.permanentMovementsRepository.listAll()
      .pipe(
        map(ms => ms
          .filter(m => format(m.start, 'yyyy-MM').localeCompare(month) <= 0 && (m.end === null ||
            format(m.end, 'yyyy-MM').localeCompare(month) >= 0))
          .map(m => ({
            id: m.id,
            name: m.name,
            amount: m.amount,
            description: m.description,
            date: setMonth(m.start, parseInt(month.split('-')[1], 10) - 1),
            type: m.type,
            status: MovementStatus.pending,
            permanentCorrelationID: m.correlationID,
            virtual: true,
            userID: m.userID,
            end: m.end
          }))))
    return zip(movements$, permanentMovements$)
      .pipe(
        map(([movements, permanentMovements]) =>
          [
            ...movements,
            ...permanentMovements.filter(p => movements.every(m => m.permanentCorrelationID !== p.permanentCorrelationID))
          ]
        )
      )
  }

  public pay(movement: Movement): Observable<unknown> {
    return this.movementsRepository.save({
      id: movement.virtual ? undefined : movement.id,
      name: movement.name,
      description: movement.description,
      amount: movement.amount,
      date: movement.date,
      type: movement.type,
      status: MovementStatus.done,
      permanentCorrelationID: movement.permanentCorrelationID,
      userID: movement.userID,
    })
  }

  public delete(movement: Movement, onlyThisOne: boolean, month = '') {
    if (movement.virtual) {
      if (onlyThisOne) {
        return this.movementsRepository.save({
          name: movement.name,
          description: movement.description,
          amount: movement.amount,
          date: movement.date,
          type: movement.type,
          status: MovementStatus.deleted,
          permanentCorrelationID: movement.permanentCorrelationID,
          userID: movement.userID,
        })
      }
      return this.permanentMovementsRepository
        .listAll()
        .pipe(
          map((permanents) => permanents.filter(p => p.correlationID === movement.permanentCorrelationID)),
          switchMap((permanents) => {
            const [permanentsToRemove, rest] = partition(permanents, p => p.start.getTime() >= movement.date.getTime())
            if (permanentsToRemove.length > 0) {
              return zip(...permanentsToRemove.map(p => this.permanentMovementsRepository.deleteById(p.id)))
                .pipe(switchMap(() => {
                  if (rest.length > 0) {
                    const last = rest.find(p => p.end === null || p.end.getTime() > movement.date.getTime())
                    if (last) {
                      return this.permanentMovementsRepository.save({
                        id: last.id,
                        correlationID: last.correlationID,
                        name: last.name,
                        description: last.description,
                        amount: last.amount,
                        start: last.start,
                        end: subMonths(movement.date, 1),
                        type: last.type,
                        userID: movement.userID,
                      })
                    }
                  }
                  return of(null)
                }))
            }

            if (rest.length > 0) {
              const last = rest.find(p => p.end === null || p.end.getTime() > movement.date.getTime())
              if (last) {
                return this.permanentMovementsRepository.save({
                  id: last.id,
                  correlationID: last.correlationID,
                  name: last.name,
                  description: last.description,
                  amount: last.amount,
                  start: last.start,
                  end: subMonths(movement.date, 1),
                  type: last.type,
                  userID: last.userID,
                })
              }
            }
            return of(null)
          }))
    }

    return this.movementsRepository.deleteById(movement.id)
  }

  public getById(id: string | null, virtual: string | null, date: string | null): Observable<Movement | null> {
    if (id === null || virtual === null || date === null
    ) {
      return of(null)
    }
    if (virtual === 'true') {
      return this.permanentMovementsRepository
        .getById(id)
        .pipe(map((permanent) => {
          return {
            id: permanent.id,
            name: permanent.name,
            amount: permanent.amount,
            description: permanent.description,
            date: parseISO(date),
            type: permanent.type,
            status: MovementStatus.pending,
            permanentCorrelationID: permanent.correlationID,
            virtual: true,
            end: permanent.end,
            userID: permanent.userID,
          }
        }))
    }
    return this.movementsRepository.getById(id)
      .pipe(map(movement => ({
        id: movement.id,
        name: movement.name,
        amount: movement.amount,
        description: movement.description,
        date: movement.date,
        type: movement.type,
        status: movement.status,
        permanentCorrelationID: movement.permanentCorrelationID,
        userID: movement.userID,
        virtual: false,
        end: null
      })))
  }

  update(movement: Movement, onlyThisOne: boolean): Observable<unknown> {
    if (movement.permanentCorrelationID !== null) {
      if (onlyThisOne) {
        return this.movementsRepository.save({
          id: movement.virtual ? undefined : movement.id,
          name: movement.name,
          description: movement.description,
          amount: movement.amount,
          date: movement.date,
          type: movement.type,
          status: MovementStatus.pending,
          permanentCorrelationID: movement.permanentCorrelationID,
          userID: movement.userID,
        })
      }
      return this.movementsRepository.listAll().pipe(
        map(movements => {
          return movements.filter(m => m.permanentCorrelationID === movement.permanentCorrelationID
            && m.date.getTime() >= movement.date.getTime())
        }),
        switchMap(movements => {
          if (movements.length > 0) {
            return zip(...movements.map(m => this.movementsRepository.deleteById(m.id)))
          }
          return of(null)
        }),
        switchMap(() => {
          return this.permanentMovementsRepository
            .listAll()
            .pipe(
              map((permanents) => permanents.filter(p => p.correlationID === movement.permanentCorrelationID)),
              switchMap((permanents) => {
                const [permanentsToRemove, rest] = partition(permanents, p => p.start.getTime() > movement.date.getTime())
                if (permanentsToRemove.length > 0) {
                  zip(...permanentsToRemove.map(p => this.permanentMovementsRepository.deleteById(p.id))).subscribe(() => {
                  })
                }
                const sameDate = rest.find(p => p.start.getTime() === movement.date.getTime())
                if (sameDate) {
                  return this.permanentMovementsRepository.save({
                    id: sameDate.id,
                    correlationID: movement.permanentCorrelationID,
                    name: movement.name,
                    description: movement.description,
                    amount: movement.amount,
                    start: movement.date,
                    end: movement.end,
                    type: movement.type,
                    userID: movement.userID,
                  })
                }
                const permanentToUpdate = rest
                  .filter(p => p.start.getTime() < movement.date.getTime() && (p.end === null || p.end.getTime() > movement.date.getTime()))
                  .map(p => ({...p, end: subMonths(movement.date, 1)}))[0]

                const permanentToCreate: PermanentMovementToSave = {
                  correlationID: movement.permanentCorrelationID,
                  name: movement.name,
                  description: movement.description,
                  amount: movement.amount,
                  start: movement.date,
                  end: null,
                  type: movement.type,
                  userID: movement.userID
                }

                return zip(
                  this.permanentMovementsRepository.save(permanentToUpdate),
                  this.permanentMovementsRepository.save(permanentToCreate)
                )
              }))
        }))
    }

    return this.movementsRepository
      .save({
        id: movement.id,
        name: movement.name,
        description: movement.description,
        amount: movement.amount,
        date: movement.date,
        type: movement.type,
        status: movement.status,
        permanentCorrelationID: movement.permanentCorrelationID,
        userID: movement.userID,
      })
  }

  private getMovementToSave(create: CreateMovement) {
    return {
      name: create.name,
      description: create.description,
      amount: create.amount,
      date: create.date,
      type: create.type,
      status: create.status,
      permanentCorrelationID: null,
      userID: '',
    };
  }
}
