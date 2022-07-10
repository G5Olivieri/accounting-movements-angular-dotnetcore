import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MovementStatus, MovementType} from "../movement";
import {parseISO} from "date-fns";
import {HttpClient} from "@angular/common/http";

export type Movement = {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type: MovementType;
  status: MovementStatus;
  userID: string;
  permanentCorrelationID: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MovementResponse = {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  type: MovementType;
  status: MovementStatus;
  userID: string;
  permanentCorrelationID: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MovementToSave = {
  id?: string;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type: MovementType;
  status: MovementStatus;
  userID: string;
  permanentCorrelationID: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MovementsRepository {
  mapFromResponseToMovement = (response: MovementResponse): Movement => ({
    id: response.id,
    permanentCorrelationID: response.permanentCorrelationID,
    name: response.name,
    description: response.description,
    amount: response.amount,
    date: parseISO(response.date.split('T')[0]),
    type: response.type,
    status: response.status,
    userID: response.userID,
    createdAt: parseISO(response.createdAt),
    updatedAt: parseISO(response.updatedAt),
  })

  mapFromResponseToMovementPipe = map<MovementResponse, Movement>(this.mapFromResponseToMovement)
  mapFromResponseArrayToMovementPipe = map<MovementResponse[], Movement[]>(m => m.map(this.mapFromResponseToMovement))

  public constructor(private httpClient: HttpClient, @Inject("BASE_URL") private baseURL: string) {

  }

  public listAll(): Observable<Movement[]> {
    return this.httpClient.get<MovementResponse[]>(this.baseURL + "api/movements")
      .pipe(this.mapFromResponseArrayToMovementPipe)
  }

  public getById(id: string): Observable<Movement> {
    return this.httpClient.get<MovementResponse>(`${this.baseURL}api/movements/${id}`)
      .pipe(this.mapFromResponseToMovementPipe)
  }

  public save(movementToSave: MovementToSave): Observable<Movement> {
    if (movementToSave.id !== undefined) {
      return this.httpClient.put<void>(`${this.baseURL}api/movements/${movementToSave.id}`, {
        ...movementToSave,
        createdAt: undefined,
        updatedAt: undefined,
      })
        .pipe(map(() => movementToSave as Movement))
    }
    return this.httpClient.post<MovementResponse>(this.baseURL + 'api/movements', {
      ...movementToSave,
      userID: '00000000-0000-0000-0000-000000000000',
      createdAt: undefined,
      updatedAt: undefined,
    })
      .pipe(this.mapFromResponseToMovementPipe)
  }

  public deleteById(id: string): Observable<unknown> {
    return this.httpClient.delete(`${this.baseURL}api/movements/${id}`)
  }
}
