import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import User from "../models/user.model.js";
/**
 * Get comprehensive reports for admin dashboard
 * @route GET /api/v1/admin/reports
 * @access Admin only
 */
export const getAdminReports = asyncHandler(async (req, res) => {
  try {
    const { range } = req.query; // 'all', 'today', 'week', 'month', 'quarter', 'year'

    // Calculate date filter based on range
    const dateFilter = getDateFilter(range);

    // Fetch complaints with date filter
    const complaints = await Complaint.find(dateFilter);
    const allComplaints = await Complaint.find(); // For overall stats

    // Calculate Issues Overview
    const totalIssues = complaints.length;
    const pending = complaints.filter(c => c.status === 'recived').length;
    const inProgress = complaints.filter(c => c.status === 'in progress').length;
    const inReview = complaints.filter(c => c.status === 'inReview').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;

    // Calculate Status Distribution (percentages)
    const statusDistribution = [
      { 
        name: 'Resolved', 
        value: totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0, 
        color: '#22c55e' 
      },
      { 
        name: 'In Progress', 
        value: totalIssues > 0 ? Math.round((inProgress / totalIssues) * 100) : 0, 
        color: '#8b5cf6' 
      },
      { 
        name: 'Pending', 
        value: totalIssues > 0 ? Math.round((pending / totalIssues) * 100) : 0, 
        color: '#f97316' 
      }
    ];

    // Calculate Monthly Trend (last 10 months)
    const monthlyTrend = calculateMonthlyTrend(allComplaints);

    // Get User & Volunteer Statistics
    const allUsers = await User.find();
    const volunteers = allUsers.filter(u => u.role === 'volunteer');
    const admins = allUsers.filter(u => u.role === 'admin');
    
    // Calculate active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await Complaint.countDocuments({
      createdAt: { $gte: today }
    });

    // Calculate new users this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Prepare response data
    const reportData = {
      issuesOverview: [
        { name: 'Total Issues', value: totalIssues, color: '#3b82f6' },
        { name: 'Pending', value: pending, color: '#f97316' },
        { name: 'In Progress', value: inProgress, color: '#8b5cf6' },
        { name: 'Resolved', value: resolved, color: '#22c55e' }
      ],
      statusDistribution,
      monthlyTrend,
      usersVolunteers: [
        { category: 'Total Users', count: allUsers.length },
        { category: 'Volunteers', count: volunteers.length },
        { category: 'Active Today', count: activeToday },
        { category: 'New This Month', count: newThisMonth }
      ],
      // Additional metrics
      systemMetrics: {
        resolutionRate: totalIssues > 0 ? Math.round((resolved / totalIssues) * 100) : 0,
        avgResponseTime: calculateAvgResponseTime(complaints),
        pendingReviews: complaints.filter(c => c.pendingUpdate).length,
        totalAdmins: admins.length
      }
    };

    return res.status(200).json(
      new ApiResponse(200, reportData, "Reports fetched successfully")
    );

  } catch (error) {
    throw new ApiError("Failed to fetch reports: " + error.message, 500);
  }
});

/**
 * Get date filter based on range
 */
function getDateFilter(range) {
  const now = new Date();
  let startDate;

  switch (range) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return {}; // All time - no date filter
  }

  return { createdAt: { $gte: startDate } };
}

/**
 * Calculate monthly trend for last 10 months
 */
function calculateMonthlyTrend(complaints) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const monthlyData = [];

  // Get last 10 months
  for (let i = 9; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const count = complaints.filter(c => {
      const createdDate = new Date(c.createdAt);
      return createdDate >= monthStart && createdDate <= monthEnd;
    }).length;

    monthlyData.push({
      month: months[targetDate.getMonth()],
      issues: count
    });
  }

  return monthlyData;
}

/**
 * Calculate average response time in hours
 */
function calculateAvgResponseTime(complaints) {
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  
  if (resolvedComplaints.length === 0) return '0h';

  const totalHours = resolvedComplaints.reduce((sum, complaint) => {
    const created = new Date(complaint.createdAt);
    const updated = new Date(complaint.updatedAt);
    const hours = Math.abs(updated - created) / 36e5; // Convert milliseconds to hours
    return sum + hours;
  }, 0);

  const avgHours = Math.round(totalHours / resolvedComplaints.length * 10) / 10;
  return `${avgHours}h`;
}

/**
 * Export reports as CSV data
 * @route GET /api/v1/admin/reports/export
 * @access Admin only
 */
export const exportReportsData = asyncHandler(async (req, res) => {
  try {
    const { range } = req.query;
    const dateFilter = getDateFilter(range);
    
    const complaints = await Complaint.find(dateFilter)
      .populate('userId', 'name email location')
      .select('title status assignedTo createdAt updatedAt address');

    // Format data for CSV export
    const csvData = complaints.map(complaint => ({
      Title: complaint.title,
      Status: complaint.status,
      AssignedTo: complaint.assignedTo,
      Location: complaint.address?.[0] || 'N/A',
      Reporter: complaint.userId?.name || 'Unknown',
      Email: complaint.userId?.email || 'N/A',
      CreatedAt: new Date(complaint.createdAt).toLocaleString(),
      UpdatedAt: new Date(complaint.updatedAt).toLocaleString()
    }));

    return res.status(200).json(
      new ApiResponse(200, csvData, "Export data prepared successfully")
    );

  } catch (error) {
    throw new ApiError("Failed to export reports: " + error.message, 500);
  }
});