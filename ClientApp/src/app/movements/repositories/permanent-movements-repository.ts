import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MovementType} from "../movement";
import {HttpClient} from "@angular/common/http";
import {parseISO} from "date-fns";

export type PermanentMovement = {
  id: string;
  correlationID: string;
  name: string;
  description: string;
  amount: number;
  start: Date;
  end: Date | null;
  type: MovementType;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PermanentMovementResponse = {
  id: string;
  correlationID: string;
  name: string;
  description: string;
  amount: number;
  start: string;
  userID: string;
  end: string | null;
  type: MovementType;
  createdAt: string;
  updatedAt: string;
}

export type PermanentMovementToSave = {
  id?: string;
  correlationID?: string | null;
  name: string;
  description: string;
  amount: number;
  start: Date;
  end: Date | null;
  type: MovementType;
  userID: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PermanentMovementsRepository {
  mapFromResponseToPermanentMovement = (response: PermanentMovementResponse): PermanentMovement => ({
    id: response.id,
    correlationID: response.correlationID,
    name: response.name,
    description: response.description,
    amount: response.amount,
    start: parseISO(response.start.split('T')[0]),
    end: response.end === null ? null : parseISO(response.end.split('T')[0]),
    type: response.type,
    userID: response.userID,
    createdAt: parseISO(response.createdAt),
    updatedAt: parseISO(response.updatedAt),
  })

  mapFromResponseToPermanentMovementPipe = map<PermanentMovementResponse, PermanentMovement>(this.mapFromResponseToPermanentMovement)
  mapFromResponseArrayToPermanentMovementPipe = map<PermanentMovementResponse[], PermanentMovement[]>(m => m.map(this.mapFromResponseToPermanentMovement))

  public constructor(private httpClient: HttpClient, @Inject("BASE_URL") private baseURL: string) {

  }

  public listAll(): Observable<PermanentMovement[]> {
    return this.httpClient.get<PermanentMovementResponse[]>(this.baseURL + "api/permanentmovements")
      .pipe(this.mapFromResponseArrayToPermanentMovementPipe)
  }

  public getById(id: string): Observable<PermanentMovement> {
    return this.httpClient.get<PermanentMovementResponse>(`${this.baseURL}api/permanentmovements/${id}`)
      .pipe(this.mapFromResponseToPermanentMovementPipe)
  }

  public save(permanentMovementToSave: PermanentMovementToSave): Observable<PermanentMovement> {
    if (permanentMovementToSave.id !== undefined) {
      return this.httpClient.put<void>(`${this.baseURL}api/permanentmovements/${permanentMovementToSave.id}`, {
        ...permanentMovementToSave,
        createdAt: undefined,
        updatedAt: undefined,
      })
        .pipe(map(() => permanentMovementToSave as PermanentMovement))
    }
    return this.httpClient.post<PermanentMovementResponse>(this.baseURL + 'api/permanentmovements', {
      ...permanentMovementToSave,
      userID: '00000000-0000-0000-0000-000000000000',
      createdAt: undefined,
      updatedAt: undefined,
    })
      .pipe(this.mapFromResponseToPermanentMovementPipe)
  }

  public deleteById(id: string): Observable<unknown> {
    return this.httpClient.delete(`${this.baseURL}api/permanentmovements/${id}`)
  }
}
