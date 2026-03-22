import { useEffect, useState } from "react";
import { getEarlyPunchOutEmployees } from "../../../api/admin.api";

interface EarlyPunchOut {
  empId: number;           // ← Backend sends "empId"
  name: string;           // ← Backend sends "name" (not "full_name")
  department: string;
  date: string;          // ← Backend sends formatted "26-01-2026"
  punchOut: string;      // ← Backend sends formatted "17:58"  
  earlyBy: string;       // ← Backend sends formatted "31m"
  earlyByMinutes: number;
}

export default function EmployeesEarlyOut() {
  const [data, setData] = useState<EarlyPunchOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEarlyPunchOutEmployees();
        console.log("API Response:", res); // Debug log
        
        // Backend returns: { success, data, summary, count }
        if (res.success && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.warn("Unexpected response format:", res);
          setData([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Early Punch-Out Employees</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Early Punch-Out Employees</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Emp ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Punch Out</th>
              <th className="p-3 border">Early By</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🌤</div>
                  <p>No early punch-outs</p>
                </td>
              </tr>
            ) : (
              data.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{emp.empId}</td>
                  <td className="p-3 border">{emp.name}</td>
                  <td className="p-3 border">{emp.department}</td>
                  <td className="p-3 border">{emp.date}</td>
                  <td className="p-3 border">{emp.punchOut}</td>
                  <td className="p-3 border font-semibold text-red-600">
                    {emp.earlyBy}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}