const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const Report = require('../models/Report');

// Helper to escape CSV fields
const escapeCSV = (val) => {
  if (val === undefined || val === null) return '';
  let str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    str = `"${str}"`;
  }
  return str;
};

// @desc    Export specific reports as CSV/HTML Printable
// @route   GET /api/reports/export
// @access  Private
exports.exportReport = async (req, res, next) => {
  try {
    const { type, format = 'CSV' } = req.query;

    if (!type) {
      return res.status(400).json({ success: false, error: 'Please specify report type (Vehicle, Driver, Trip, Fuel, Expense, Maintenance)' });
    }

    let csvContent = '';
    let reportData = [];
    let filename = `transitops-${type.toLowerCase()}-report-${Date.now()}`;

    if (type === 'Vehicle') {
      const data = await Vehicle.find().populate('assignedDriver');
      const headers = ['Registration Number', 'Vehicle Name', 'Model', 'Type', 'Capacity', 'Fuel Type', 'Odometer (km)', 'Insurance Expiry', 'Status', 'Assigned Driver'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';
      
      data.forEach((v) => {
        const row = [
          v.regNumber,
          v.name,
          v.model,
          v.type,
          v.capacity,
          v.fuelType,
          v.odometer,
          v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : '',
          v.status,
          v.assignedDriver ? v.assignedDriver.name : 'Unassigned',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else if (type === 'Driver') {
      const data = await Driver.find().populate('assignedVehicle');
      const headers = ['Driver Name', 'License Number', 'Phone', 'Email', 'Experience (Years)', 'Safety Score (%)', 'Availability', 'Assigned Vehicle'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';

      data.forEach((d) => {
        const row = [
          d.name,
          d.licenseNumber,
          d.phone,
          d.email,
          d.experience,
          d.safetyScore,
          d.availability,
          d.assignedVehicle ? d.assignedVehicle.regNumber : 'None',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else if (type === 'Trip') {
      const data = await Trip.find().populate('vehicle').populate('driver');
      const headers = ['Trip ID', 'Vehicle Reg', 'Driver Name', 'Source', 'Destination', 'Distance (km)', 'Cargo Weight (Tons)', 'Est. Duration (hrs)', 'Status', 'Start Date', 'End Date'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';

      data.forEach((t) => {
        const row = [
          t.tripId,
          t.vehicle ? t.vehicle.regNumber : '',
          t.driver ? t.driver.name : '',
          t.source,
          t.destination,
          t.distance,
          t.cargoWeight,
          t.estDuration,
          t.status,
          t.startDate ? new Date(t.startDate).toLocaleDateString() : '',
          t.endDate ? new Date(t.endDate).toLocaleDateString() : '',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else if (type === 'Fuel') {
      const data = await FuelLog.find().populate('vehicle').populate('driver');
      const headers = ['Vehicle Reg', 'Driver Name', 'Quantity (Liters)', 'Cost ($)', 'Odometer Reading', 'Date'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';

      data.forEach((f) => {
        const row = [
          f.vehicle ? f.vehicle.regNumber : '',
          f.driver ? f.driver.name : '',
          f.quantity,
          f.cost,
          f.odometer,
          f.date ? new Date(f.date).toLocaleDateString() : '',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else if (type === 'Expense') {
      const data = await Expense.find().populate('vehicle');
      const headers = ['Expense Type', 'Vehicle Reg', 'Cost ($)', 'Description', 'Date'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';

      data.forEach((e) => {
        const row = [
          e.expenseType,
          e.vehicle ? e.vehicle.regNumber : 'Fleet Wide',
          e.cost,
          e.description,
          e.date ? new Date(e.date).toLocaleDateString() : '',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else if (type === 'Maintenance') {
      const data = await Maintenance.find().populate('vehicle');
      const headers = ['Vehicle Reg', 'Service Type', 'Description', 'Cost ($)', 'Status', 'Start Date', 'End Date'];
      csvContent += headers.map(escapeCSV).join(',') + '\n';

      data.forEach((m) => {
        const row = [
          m.vehicle ? m.vehicle.regNumber : '',
          m.serviceType,
          m.description,
          m.cost,
          m.status,
          m.startDate ? new Date(m.startDate).toLocaleDateString() : '',
          m.endDate ? new Date(m.endDate).toLocaleDateString() : '',
        ];
        csvContent += row.map(escapeCSV).join(',') + '\n';
      });
      reportData = data;
    } else {
      return res.status(400).json({ success: false, error: 'Invalid report type' });
    }

    // Save report generation metadata in db
    await Report.create({
      reportType: type,
      generatedBy: req.user._id,
      filePath: `/${filename}.${format.toLowerCase()}`,
      format,
    });

    if (format.toUpperCase() === 'CSV') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      return res.status(200).send(csvContent);
    } else {
      // Return printable HTML layout simulating a PDF page
      res.setHeader('Content-Type', 'text/html');
      let htmlContent = `
        <html>
          <head>
            <title>${type} Report</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #0F172A; color: #F1F5F9; padding: 20px; }
              h1 { color: #14B8A6; border-bottom: 2px solid #1E293B; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #1E293B; padding: 10px; text-align: left; }
              th { background-color: #1E293B; color: #14B8A6; }
              tr:nth-child(even) { background-color: #1E293B; }
              .footer { margin-top: 40px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 10px; }
            </style>
          </head>
          <body onload="window.print()">
            <h1>TransitOps ${type} Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Generated by: ${req.user.name} (${req.user.role})</p>
            <table>
              <thead>
                <tr>
                  ${type === 'Vehicle' ? '<th>Reg Number</th><th>Name</th><th>Model</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Status</th>' : ''}
                  ${type === 'Driver' ? '<th>Name</th><th>License</th><th>Phone</th><th>Email</th><th>Exp (Yrs)</th><th>Score</th><th>Status</th>' : ''}
                  ${type === 'Trip' ? '<th>Trip ID</th><th>Source</th><th>Destination</th><th>Distance (km)</th><th>Weight</th><th>Status</th>' : ''}
                  ${type === 'Fuel' ? '<th>Vehicle</th><th>Driver</th><th>Quantity (L)</th><th>Cost</th><th>Odo</th><th>Date</th>' : ''}
                  ${type === 'Expense' ? '<th>Type</th><th>Vehicle</th><th>Cost</th><th>Description</th><th>Date</th>' : ''}
                  ${type === 'Maintenance' ? '<th>Vehicle</th><th>Type</th><th>Description</th><th>Cost</th><th>Status</th><th>Date</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${reportData.map(item => `
                  <tr>
                    ${type === 'Vehicle' ? `<td>${item.regNumber}</td><td>${item.name}</td><td>${item.model}</td><td>${item.type}</td><td>${item.capacity}</td><td>${item.odometer}</td><td>${item.status}</td>` : ''}
                    ${type === 'Driver' ? `<td>${item.name}</td><td>${item.licenseNumber}</td><td>${item.phone}</td><td>${item.email}</td><td>${item.experience}</td><td>${item.safetyScore}%</td><td>${item.availability}</td>` : ''}
                    ${type === 'Trip' ? `<td>${item.tripId}</td><td>${item.source}</td><td>${item.destination}</td><td>${item.distance}</td><td>${item.cargoWeight} tons</td><td>${item.status}</td>` : ''}
                    ${type === 'Fuel' ? `<td>${item.vehicle ? item.vehicle.regNumber : ''}</td><td>${item.driver ? item.driver.name : ''}</td><td>${item.quantity}</td><td>$${item.cost}</td><td>${item.odometer}</td><td>${new Date(item.date).toLocaleDateString()}</td>` : ''}
                    ${type === 'Expense' ? `<td>${item.expenseType}</td><td>${item.vehicle ? item.vehicle.regNumber : 'Fleet'}</td><td>$${item.cost}</td><td>${item.description}</td><td>${new Date(item.date).toLocaleDateString()}</td>` : ''}
                    ${type === 'Maintenance' ? `<td>${item.vehicle ? item.vehicle.regNumber : ''}</td><td>${item.serviceType}</td><td>${item.description}</td><td>$${item.cost}</td><td>${item.status}</td><td>${new Date(item.startDate).toLocaleDateString()}</td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              TransitOps Telemetry Board &copy; ${new Date().getFullYear()} - Confidentially generated document.
            </div>
          </body>
        </html>
      `;
      return res.status(200).send(htmlContent);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical reports list
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('generatedBy').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};
