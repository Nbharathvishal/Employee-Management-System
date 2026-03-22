import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../../../api/admin.api";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    role: "EMPLOYEE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createEmployee(form as any);
      alert("Employee created successfully ✅");
      navigate("/admin/employees");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Add New Employee
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Department" name="department" value={form.department} onChange={handleChange} />
        <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />

        {/* Date of Joining */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date of Joining
          </label>
          <input
            type="date"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="bg-gray-200 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🔹 Input Component */
function Input({
  label,
  ...props
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
