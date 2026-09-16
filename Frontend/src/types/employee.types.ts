export interface EmployeeProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  date_of_joining: string;
  employee_id: string;
  address?: string;
  emergency_contact?: string;
  profile_picture?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LeaveApplication {
  id: number;
  leaveType: 'CASUAL' | 'SICK' | 'EARNED';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminRemarks?: string;
  appliedOn: string;
  numberOfDays: number;
}

export interface StickyNote {
  id: number;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
  lateBy?: string;
  earlyOut?: string;
}

export interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalEarlyOut: number;
  averageHours: number;
  monthlySummary: MonthlySummary[];
}

export interface MonthlySummary {
  month: string;
  presentDays: number;
  workingDays: number;
  attendancePercentage: number;
}