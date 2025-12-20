// components/common/DateTimePicker.jsx - Modern & User-Friendly
import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const DateTimePicker = ({ value, onChange, label = 'Select Date & Time' }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Parse initial value if provided
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date.toISOString().split('T')[0]);
      setSelectedTime(date.toTimeString().slice(0, 5));
    }
  }, [value]);

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    
    if (newDate && selectedTime) {
      const dateTime = new Date(`${newDate}T${selectedTime}`);
      onChange(dateTime.toISOString());
    }
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    
    if (selectedDate && newTime) {
      const dateTime = new Date(`${selectedDate}T${newTime}`);
      onChange(dateTime.toISOString());
    }
  };

  // Quick time selection options
  const timeSlots = [
    { label: '8:00 AM', value: '08:00' },
    { label: '9:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '1:00 PM', value: '13:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '3:00 PM', value: '15:00' },
    { label: '4:00 PM', value: '16:00' },
    { label: '5:00 PM', value: '17:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '7:00 PM', value: '19:00' },
    { label: '8:00 PM', value: '20:00' },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-600">*</span>
      </label>

      {/* Date Selection */}
      <div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none text-gray-700"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select delivery date (today to 3 months ahead)
        </p>
      </div>

      {/* Time Selection - Button Grid */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-gray-400" size={18} />
          <span className="text-sm font-medium text-gray-700">Select Time</span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => handleTimeChange({ target: { value: slot.value } })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTime === slot.value
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Or enter custom time:{' '}
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            required
            className="inline-block px-2 py-1 border border-gray-300 rounded text-sm ml-1"
          />
        </p>
      </div>

      {/* Selected Date/Time Display */}
      {selectedDate && selectedTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">
            📅 Delivery scheduled for:{' '}
            <span className="font-bold">
              {new Date(`${selectedDate}T${selectedTime}`).toLocaleString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;