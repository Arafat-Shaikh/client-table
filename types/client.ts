export type ClientType = "Individual" | "Company"
export type ClientStatus = "Active" | "Inactive" | "Pending"
export type SortField = "name" | "id" | "createdAt" | "updatedAt"
export type SortDirection = "asc" | "desc"

export interface Client {
  id: number
  name: string
  type: ClientType
  email: string
  status: ClientStatus
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export interface SortCriterion {
  field: SortField
  direction: SortDirection
  id: string // Unique ID for drag and drop
}
