import { useEffect, useState } from "react";
import {
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../../../api/admin.api";

interface LeaveRequest {
  id: number;
  employee_id: number;
  full_name: string;
  leave_type: string;
  reason: string;
  from_date: string;
  to_date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  admin_remarks?: string;
}

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  const loadLeaves = async () => {
    const data = await getAllLeaveRequests();
    setLeaves(data);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = async (
    leaveId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    await updateLeaveStatus(
      leaveId,
      status,
      remarks[leaveId] || ""
    );

    // UI update without refresh
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              admin_remarks: remarks[leaveId],
            }
          : l
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Leave Requests
      </h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Emp ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">From</th>
              <th className="p-3 border">To</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Admin Remarks</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td className="p-3 border">
                  {leave.employee_id}
                </td>
                <td className="p-3 border">
                  {leave.full_name}
                </td>
                <td className="p-3 border">
                  {leave.leave_type}
                </td>
                <td className="p-3 border">
                  {leave.reason}
                </td>
                <td className="p-3 border">
                  {leave.from_date}
                </td>
                <td className="p-3 border">
                  {leave.to_date}
                </td>

                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        leave.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="p-3 border">
                  <input
                    type="text"
                    placeholder="Remarks"
                    disabled={leave.status !== "PENDING"}
                    value={remarks[leave.id] || ""}
                    onChange={(e) =>
                      setRemarks({
                        ...remarks,
                        [leave.id]: e.target.value,
                      })
                    }
                    className="border px-2 py-1 w-full"
                  />
                </td>

                <td className="p-3 border space-x-2">
                  {leave.status === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(
                            leave.id,
                            "APPROVED"
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleAction(
                            leave.id,
                            "REJECTED"
                          )
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {leaves.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center p-4 text-gray-500"
                >
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
