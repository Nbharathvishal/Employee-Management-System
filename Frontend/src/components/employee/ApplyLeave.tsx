import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, AlertCircle, Clock } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const ApplyLeave: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leave_type: '',   // snake_case as per your backend
    from_date: '',    // snake_case as per your backend
    to_date: '',      // snake_case as per your backend
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const leaveTypes = [
    { value: 'CASUAL', label: 'Casual Leave', description: 'For personal work or emergencies' },
    { value: 'SICK', label: 'Sick Leave', description: 'For medical reasons or health issues' },
    { value: 'EARNED', label: 'Earned Leave', description: 'Accumulated paid time off' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate dates
    if (formData.from_date && formData.to_date) {
      const fromDate = new Date(formData.from_date);
      const toDate = new Date(formData.to_date);
      
      if (toDate < fromDate) {
        setError('To date cannot be earlier than from date');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/leaves', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Leave application submitted successfully!');
        // Clear form
        setFormData({
          leave_type: '',
          from_date: '',
          to_date: '',
          reason: ''
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit leave application');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-blue-800">
              Apply for Leave
            </h1>
          </div>
          <p className="text-slate-600 mb-6">
            Fill in the details below to submit your leave application. All fields are required.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
              <div>
                <span className="font-medium">Error:</span> {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3">
              <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
              <div>
                <span className="font-medium">Success:</span> {success}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Leave Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {leaveTypes.map(type => (
                  <div 
                    key={type.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      formData.leave_type === type.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-300 hover:border-blue-300'
                    }`}
                    onClick={() => setFormData({...formData, leave_type: type.value})}
                  >
                    <div className="font-medium text-slate-800">{type.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{type.description}</div>
                  </div>
                ))}
              </div>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Or select from dropdown</option>
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  From Date *
                </label>
                <input
                  type="date"
                  name="from_date"
                  value={formData.from_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Clock size={16} />
                  To Date *
                </label>
                <input
                  type="date"
                  name="to_date"
                  value={formData.to_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min={formData.from_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Reason for Leave *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Please provide a detailed reason for your leave application..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Be specific about the purpose of your leave. Minimum 10 characters required.
              </p>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Important Notes:
              </h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Leave balance will be deducted immediately upon submission</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Applications will be reviewed by your manager/admin</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>You will be notified when your application is approved or rejected</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Please apply at least 2 working days in advance for planned leaves</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Application'
                )}
              </button>
              <p className="text-center text-sm text-slate-500 mt-3">
                By submitting, you agree to the company's leave policy
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;