export type LeaveType =
  | 'CASUAL'
  | 'SICK'
  | 'EARNED'


export interface ApplyLeavePayload {
  employeeId: number
  leaveType: string      
  fromDate: string       
  toDate: string         
  reason: string
}

