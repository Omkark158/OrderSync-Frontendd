// ============================================
// 3. DatePicker.jsx - Date & Time Picker
// ============================================
import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

const DatePicker = ({ value, onChange, label = 'Delivery Date & Time' }) => {
  const [selectedDate, setSelectedDate] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    onChange(newValue);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // Minimum 2 hours from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={handleChange}
          min={getMinDateTime()}
          required
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Select a date and time at least 2 hours from now
      </p>
    </div>
  );
};

export default DatePicker;
