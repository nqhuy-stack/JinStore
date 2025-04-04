// File: src/pages/admin/Dashboard.jsx
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('month');

  // Data for different time periods
  const chartData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Revenue 2024',
          data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Revenue 2023',
          data: [1000, 1600, 1300, 1800, 1500, 2000, 1800],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    weekOfMonth: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [
        {
          label: 'Revenue March 2024',
          data: [8500, 9200, 8800, 9500, 9000],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Revenue March 2023',
          data: [7800, 8500, 8200, 8800, 8400],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue 2024',
          data: [3000, 4500, 3800, 5200, 4800, 6000, 5500, 7000, 6800, 7500, 8200, 9000],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Revenue 2023',
          data: [2800, 3900, 3200, 4800, 4200, 5500, 5000, 6200, 6000, 6800, 7500, 8200],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    monthOfYear: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Revenue 2024',
          data: [11300, 16000, 19300, 24700],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Revenue 2023',
          data: [9900, 14500, 18200, 23000],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2ecc71',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    year: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Annual Revenue',
          data: [45000, 52000, 58000, 65000, 75000],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Poppins', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text:
          timePeriod === 'week'
            ? 'Weekly Revenue'
            : timePeriod === 'weekOfMonth'
              ? 'Weekly Revenue (March)'
              : timePeriod === 'month'
                ? 'Monthly Revenue'
                : timePeriod === 'monthOfYear'
                  ? 'Quarterly Revenue'
                  : 'Annual Revenue',
        font: {
          size: 20,
          weight: 'bold',
          family: "'Poppins', sans-serif",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: "'Poppins', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Poppins', sans-serif",
        },
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumSignificantDigits: 3,
            }).format(value),
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
          padding: 10,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Calculate total revenue based on current time period
  const calculateTotalRevenue = () => {
    const currentData = chartData[timePeriod].datasets[0].data;
    return currentData.reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <section className="admin__section">
      <h2 className="admin__section-title">Dashboard Overview</h2>

      <div className="admin__stats">
        <div className="admin__stat-card">
          <h3>Total Products</h3>
          <p>150</p>
        </div>
        <div className="admin__stat-card">
          <h3>Total Orders</h3>
          <p>320</p>
        </div>
        <div className="admin__stat-card">
          <h3>Total Users</h3>
          <p>50</p>
        </div>
        <div className="admin__stat-card">
          <h3>Total Revenue</h3>
          <p>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(calculateTotalRevenue())}
          </p>
        </div>
      </div>

      <div className="admin__chart-section">
        <div className="admin__chart-header">
          <div className="admin__chart-title">
            <FontAwesomeIcon icon={faCalendar} className="admin__chart-icon" />
            <h3>Revenue Overview</h3>
          </div>
          <div className="admin__chart-controls">
            <button
              className={`admin__chart-btn ${timePeriod === 'week' ? 'active' : ''}`}
              onClick={() => setTimePeriod('week')}
            >
              Week
            </button>
            <button
              className={`admin__chart-btn ${timePeriod === 'weekOfMonth' ? 'active' : ''}`}
              onClick={() => setTimePeriod('weekOfMonth')}
            >
              Week of Month
            </button>
            <button
              className={`admin__chart-btn ${timePeriod === 'month' ? 'active' : ''}`}
              onClick={() => setTimePeriod('month')}
            >
              Month
            </button>
            <button
              className={`admin__chart-btn ${timePeriod === 'monthOfYear' ? 'active' : ''}`}
              onClick={() => setTimePeriod('monthOfYear')}
            >
              Quarter
            </button>
            <button
              className={`admin__chart-btn ${timePeriod === 'year' ? 'active' : ''}`}
              onClick={() => setTimePeriod('year')}
            >
              Year
            </button>
          </div>
        </div>
        <div className="admin__chart-container">
          <Line data={chartData[timePeriod]} options={chartOptions} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
