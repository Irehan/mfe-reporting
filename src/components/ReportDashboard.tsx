import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ReportDashboard.css';

interface BookingData {
  id: string;
  facility: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface ReportProps {
  user?: { role: 'admin' | 'user' };
}

const initialData = {
  facilityUsage: [
    { name: 'Conference Room 1', value: 30 },
    { name: 'Conference Room 2', value: 25 },
    { name: 'Auditorium', value: 20 },
    { name: 'Training Room', value: 25 },
  ],
  bookingTrends: [
    { month: 'Jan', bookings: 10 },
    { month: 'Feb', bookings: 15 },
    { month: 'Mar', bookings: 20 },
    { month: 'Apr', bookings: 18 },
    { month: 'May', bookings: 22 },
    { month: 'Jun', bookings: 25 },
  ],
};

const ReportDashboard: React.FC<ReportProps> = ({ user }) => {
  const [data, setData] = useState(initialData);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (typeof window !== 'undefined' && (window as any).eventBus) {
      const eventBus = (window as any).eventBus;

      const handleBookingEvent = (event: { payload: BookingData }) => {
        setBookings((prev) => [...prev, event.payload]);
        setData((prev) => {
          const updatedUsage = prev.facilityUsage.map((item) =>
            item.name === event.payload.facility ? { ...item, value: item.value + 1 } : item
          );
          return { ...prev, facilityUsage: updatedUsage };
        });
      };

      eventBus.on('booking:created', handleBookingEvent);
      eventBus.on('booking:updated', handleBookingEvent);

      return () => {
        eventBus.off('booking:created', handleBookingEvent);
        eventBus.off('booking:updated', handleBookingEvent);
      };
    }
  }, []);

  if (user?.role !== 'admin') {
    return <div className="access-denied">Access Denied: Admin only.</div>;
  }

  if (isLoading) return <div className="loading">Loading reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="report-dashboard">
      <h2>Reporting Dashboard</h2>
      <div className="charts">
        <div className="chart">
          <h3>Facility Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.facilityUsage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Booking Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="metrics">
        <p>Total Bookings: {bookings.length}</p>
      </div>
    </div>
  );
};

export default ReportDashboard;