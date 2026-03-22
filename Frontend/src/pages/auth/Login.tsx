import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import portalImage from "../../assets/images/portalLogin.png";


export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginApi({ email, password });

      if (res.role !== role?.toUpperCase()) {
        alert("Role mismatch");
        return;
      }

      login(res.token, { role: res.role });

      if (res.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Please enter log in details below
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Sign in
            </button>

            

            

            

            {/* Hidden role indicator - kept for your existing logic */}
            <div className="hidden text-sm text-center text-gray-500">
              {role?.toUpperCase()} Portal
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image/Content */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <div className="mb-8">
              <img 
                src={portalImage} 
                alt="Dashboard Preview" 
                className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Your Status
              </h2>
              
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}