export enum MovementType {
  expense = 0,
  income = 1,
}

export enum MovementStatus {
  pending = 'pending',
  done = 'done',
  deleted = 'deleted',
}

export type Movement = {
  id: string
  name: string
  amount: number
  description: string
  date: Date
  type: MovementType
  status: MovementStatus
  permanentCorrelationID: string | null
  virtual: boolean
  userID: string
  end: Date | null
}
