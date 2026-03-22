import { useEffect, useState } from "react";
import { getAllEmployees, updateEmployee } from "../../../api/admin.api";

/* =====================
   TYPES
===================== */
interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: string;
}

/* =====================
   CELL COMPONENT
===================== */
function EditableCell({
  value,
  isEditing,
  onClick,
  onChange,
}: {
  value: string;
  isEditing: boolean;
  onClick: () => void;
  onChange: (v: string) => void;
}) {
  return (
    <td className="p-3 border cursor-pointer" onClick={onClick}>
      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      ) : (
        value
      )}
    </td>
  );
}

/* =====================
   MAIN COMPONENT
===================== */
export default function EditEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [editingEmployeeId, setEditingEmployeeId] =
    useState<number | null>(null);
  const [editingField, setEditingField] =
    useState<keyof Employee | null>(null);

  const [editedEmployee, setEditedEmployee] =
    useState<Partial<Employee>>({});

  const [originalEmployee, setOriginalEmployee] =
    useState<Employee | null>(null);

  const [isDirty, setIsDirty] = useState(false);

  /* LOAD EMPLOYEES */
  const loadEmployees = async () => {
    const data = await getAllEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* START EDIT */
  const startEdit = (emp: Employee, field: keyof Employee) => {
    setEditingEmployeeId(emp.id);
    setEditingField(field);

    setOriginalEmployee(emp);        // store original
    setEditedEmployee({ ...emp });   // editable copy

    setIsDirty(false);
  };

  /* CHANGE FIELD */
  const handleChange = (field: keyof Employee, value: string) => {
    const updated = {
      ...editedEmployee,
      [field]: value,
    };

    setEditedEmployee(updated);

    // enable update ONLY if something really changed
    if (originalEmployee) {
      const hasChanged = (
        ["full_name", "email", "phone", "department", "designation"] as (keyof Employee)[]
      ).some((key) => updated[key] !== originalEmployee[key]);

      setIsDirty(hasChanged);
    }
  };

  /* UPDATE DB */
  const handleUpdate = async () => {
  if (!editingEmployeeId || !isDirty) return;

  setIsDirty(false);

  try {
    const payload = {
      fullName: editedEmployee.full_name,
      email: editedEmployee.email,
      phone: editedEmployee.phone,
      department: editedEmployee.department,
      designation: editedEmployee.designation,
      status: editedEmployee.status,
    };

    await updateEmployee(editingEmployeeId, payload);

    setOriginalEmployee({ ...(editedEmployee as Employee) });
    loadEmployees();
    alert("Employee updated successfully!");
  } catch (err: any) {
    console.error("Update failed:", err);
    alert(err.message || "Failed to update employee.");
    setIsDirty(true);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Employees</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Designation</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <EditableCell
                  value={
                    editingEmployeeId === emp.id &&
                    editingField === "full_name"
                      ? editedEmployee.full_name || ""
                      : emp.full_name
                  }
                  isEditing={
                    editingEmployeeId === emp.id &&
                    editingField === "full_name"
                  }
                  onClick={() => startEdit(emp, "full_name")}
                  onChange={(v) => handleChange("full_name", v)}
                />

                <EditableCell
                  value={
                    editingEmployeeId === emp.id &&
                    editingField === "email"
                      ? editedEmployee.email || ""
                      : emp.email
                  }
                  isEditing={
                    editingEmployeeId === emp.id &&
                    editingField === "email"
                  }
                  onClick={() => startEdit(emp, "email")}
                  onChange={(v) => handleChange("email", v)}
                />

                <EditableCell
                  value={
                    editingEmployeeId === emp.id &&
                    editingField === "phone"
                      ? editedEmployee.phone || ""
                      : emp.phone
                  }
                  isEditing={
                    editingEmployeeId === emp.id &&
                    editingField === "phone"
                  }
                  onClick={() => startEdit(emp, "phone")}
                  onChange={(v) => handleChange("phone", v)}
                />

                <EditableCell
                  value={
                    editingEmployeeId === emp.id &&
                    editingField === "department"
                      ? editedEmployee.department || ""
                      : emp.department
                  }
                  isEditing={
                    editingEmployeeId === emp.id &&
                    editingField === "department"
                  }
                  onClick={() => startEdit(emp, "department")}
                  onChange={(v) => handleChange("department", v)}
                />

                <EditableCell
                  value={
                    editingEmployeeId === emp.id &&
                    editingField === "designation"
                      ? editedEmployee.designation || ""
                      : emp.designation
                  }
                  isEditing={
                    editingEmployeeId === emp.id &&
                    editingField === "designation"
                  }
                  onClick={() => startEdit(emp, "designation")}
                  onChange={(v) => handleChange("designation", v)}
                />

                <td className="p-3 border">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UPDATE BUTTON */}
      <div className="mt-4">
        <button
          disabled={!isDirty}
          onClick={handleUpdate}
          className={`px-6 py-2 rounded font-medium
            ${
              isDirty
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Update
        </button>
      </div>
    </div>
  );
}
