import { useEffect, useState } from "react";
import { getLatePunchInEmployees } from "../../../api/admin.api";

interface LatePunchIn {
  empId: number;
  name: string;
  department: string;
  date: string;
  punchIn: string;
  lateBy: string;
}
interface ApiResponse {
  success: boolean;
  data: LatePunchIn[];
  count: number;
}
export default function EmployeesLateIn() {
  const [data, setData] = useState<LatePunchIn[]>([]);
  const [loading, setLoading] = useState(true);

// Update the data loading part
useEffect(() => {
  const load = async () => {
    try {
      console.log("🔄 Loading late punch-ins...");
      const res = await getLatePunchInEmployees();
      console.log("📊 Raw response:", res);
      
      if (Array.isArray(res)) {
        // Transform backend data to match frontend interface
        const transformedData = res.map(item => ({
          empId: item.employee_id,
          name: item.full_name,
          department: item.department,
          date: item.date,
          punchIn: item.punch_in,
          lateBy: item.late_by
        }));
        
        setData(transformedData);
      } else {
        console.warn("Unexpected response format:", res);
        setData([]);
      }
    } catch (err) {
      console.error("❌ Error loading data:", err);
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
        <h1 className="text-2xl font-bold mb-4">Late Punch-In Employees</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Late Punch-In Employees</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Emp ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Punch In</th>
              <th className="p-3 border">Late By</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">💤</div>
                  <p>No late punch-ins</p>
                </td>
              </tr>
            ) : (
              data.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">{emp.empId}</td>
                  <td className="p-3 border">{emp.name}</td>
                  <td className="p-3 border">{emp.department}</td>
                  <td className="p-3 border">{emp.date}</td>
                  <td className="p-3 border">{emp.punchIn}</td>
                  <td className="p-3 border font-semibold text-yellow-600">
                    {emp.lateBy}
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