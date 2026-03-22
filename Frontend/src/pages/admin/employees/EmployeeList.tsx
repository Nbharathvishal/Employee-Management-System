
import { useEffect, useState } from "react";
import { getAllEmployees } from "../../../api/admin.api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        All Employees
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Department</Th>
              <Th>Designation</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <Td>{emp.full_name}</Td>
                <Td>{emp.email}</Td>
                <Td>{emp.phone || "-"}</Td>
                <Td>{emp.department}</Td>
                <Td>{emp.designation}</Td>
                <Td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      emp.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* small helpers */
const Th = ({ children }: any) => (
  <th className="text-left px-4 py-3 font-medium">{children}</th>
);
const Td = ({ children }: any) => (
  <td className="px-4 py-3">{children}</td>
);
