import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Since external file imports failed, all page logic is defined within this single file.

// --- Placeholder Components for Routing ---
// These satisfy the routes for pages not yet designed.

const Placeholder = ({ title }) => (
  <div className="flex justify-center items-center h-screen bg-gray-100 p-8">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-blue-600">{title}</h2>
        <p className="text-lg text-gray-600 mt-2">Design coming soon!</p>
    </div>
  </div>
);

const Login = () => <Placeholder title="Login" />;
const Dashboard = () => <Placeholder title="Dashboard" />;
const Issues = () => <Placeholder title="Issues" />; // Main Issue List
const Home = () => <Placeholder title="Home" />;
const Profile = () => <Placeholder title="Profile" />;
const Help = () => <Placeholder title="Help" />;
const About = () => <Placeholder title="About" />;
const SignUp = () => <Placeholder title="SignUp" />;
const UsersVolunteers = () => <Placeholder title="Users & Volunteers" />; // Placeholder for the next page

// --- 1. AdminRequests Component (Admin Requests Page) ---

const AdminRequests = () => {
  const [requests, setRequests] = useState([
    { id: 'req1', name: 'Emily Rodriguez', email: 'emilyr@citycouncil.gov', department: 'Public Works', requestedDate: '1/23/2024' },
    { id: 'req2', name: 'David Kim', email: 'david.kim@citycouncil.gov', department: 'Environmental Services', requestedDate: '1/22/2024' },
  ]);

  const handleAction = (id, action) => {
    console.log(`${action} request with ID: ${id}`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Admin Requests</h1>
        <p className="text-sm text-gray-500">Review and approve new administrator access requests</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Pending Admin Requests</h2>
        <p className="text-sm text-gray-500 mb-6">Review requests from users seeking administrator privileges</p>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center p-8 text-gray-500 italic">No pending admin requests.</div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="request-card border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                  <div className="flex items-center flex-1 min-w-0 mb-4 sm:mb-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold text-lg border border-blue-400 flex-shrink-0">
                      {request.name.charAt(0)}
                    </div>
                    <div className="ml-4 min-w-0">
                      <div className="text-base font-semibold text-gray-800 truncate">{request.name}</div>
                      <div className="text-sm text-gray-500 truncate">{request.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-8 sm:space-x-12 flex-wrap flex-1 min-w-[200px] mb-4 sm:mb-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400 uppercase">Department</span>
                      <span className="text-sm text-gray-700 font-medium">{request.department}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400 uppercase">Requested Date</span>
                      <span className="text-sm text-gray-700 font-medium">{request.requestedDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    <button
                      className="flex items-center justify-start px-4 py-2 w-32 rounded-lg text-sm font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition duration-150"
                      onClick={() => handleAction(request.id, 'Approving')}
                    >
                      <i className="fas fa-check-circle mr-2"></i> Approve
                    </button>
                    <button
                      className="flex items-center justify-start px-4 py-2 w-32 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition duration-150"
                      onClick={() => handleAction(request.id, 'Rejecting')}
                    >
                      <i className="fas fa-times-circle mr-2"></i> Reject
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2 w-full mt-2">
                  <i className="fas fa-info-circle text-lg flex-shrink-0 mt-0.5"></i>
                  <span>Note: Approving this request will grant full administrative privileges including user management, issue oversight, and system configuration.</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2. IssueUpdates Component (All Issues/Issue Updates Page) ---

const IssueUpdates = () => {
    const [updates, setUpdates] = useState([
        {
            id: 'issue1',
            title: 'Broken streetlight on Main St',
            updater: 'Sarah Wilson',
            statusChange: { from: 'in progress', to: 'resolved' },
            submittedDate: '1/23/2024',
            proofPhoto: 'Attached',
            volunteerNotes: 'Replaced bulb and checked electrical connections. Issue is now fully resolved.',
        },
        {
            id: 'issue2',
            title: 'Pothole on Oak Street',
            updater: 'Mike Thompson',
            statusChange: { from: 'reported', to: 'in progress' },
            submittedDate: '1/23/2024',
            proofPhoto: 'None',
            volunteerNotes: 'Team dispatched, temporary patching material applied. Will follow up with permanent repair next week.',
        },
    ]);

    // Tailwind helper for status badges
    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'reported':
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    const handleAction = (id, action) => {
        console.log(`${action} issue update with ID: ${id}`);
        setUpdates(updates.filter((update) => update.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 sm:p-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Issue Updates</h1>
                <p className="text-sm text-gray-500">Review and approve status updates submitted by volunteers</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Pending Issue Updates</h2>
                <p className="text-sm text-gray-500 mb-6">Review status changes and work progress submitted by field volunteers</p>

                <div className="space-y-6">
                    {updates.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 italic">No pending issue updates.</div>
                    ) : (
                        updates.map((issue) => (
                            <div key={issue.id} className="issue-card border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm flex flex-col gap-4">
                                
                                <div className="flex justify-between items-start flex-wrap gap-4">
                                    <div className="flex items-start flex-1 min-w-[250px]">
                                        <i className="fas fa-clock text-2xl text-blue-500 mr-4 mt-1 flex-shrink-0"></i>
                                        <div className='min-w-0'>
                                            <div className="text-lg font-semibold text-gray-900 truncate">{issue.title}</div>
                                            <div className="text-sm text-gray-500">Updated by {issue.updater}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col space-y-2 flex-shrink-0">
                                        <button
                                            className="flex items-center justify-start px-4 py-2 w-32 rounded-lg text-sm font-semibold bg-green-50 text-green-600 hover:bg-green-100 transition duration-150"
                                            onClick={() => handleAction(issue.id, 'Approving')}
                                        >
                                            <i className="fas fa-check-circle mr-2"></i> Approve
                                        </button>
                                        <button
                                            className="flex items-center justify-start px-4 py-2 w-32 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition duration-150"
                                            onClick={() => handleAction(issue.id, 'Rejecting')}
                                        >
                                            <i className="fas fa-times-circle mr-2"></i> Reject
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm w-full border-t pt-4 mt-2">
                                    
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-400 uppercase mb-1">Status Change</span>
                                        <div className='flex items-center space-x-2'>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(issue.statusChange.from)}`}>
                                                {issue.statusChange.from}
                                            </span>
                                            <i className="fas fa-long-arrow-alt-right text-gray-400"></i>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(issue.statusChange.to)}`}>
                                                {issue.statusChange.to}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-400 uppercase mb-1">Submitted</span>
                                        <span className="text-sm text-gray-700 font-medium">{issue.submittedDate}</span>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-400 uppercase mb-1">Proof Photo</span>
                                        <div className='flex items-center space-x-1'>
                                            {issue.proofPhoto === 'Attached' ? (
                                                <i className="fas fa-paperclip text-green-500"></i>
                                            ) : (
                                                <i className="fas fa-times-circle text-red-500"></i>
                                            )}
                                            <span className={`text-sm font-medium ${issue.proofPhoto === 'Attached' ? 'text-green-600' : 'text-gray-500'}`}>
                                                {issue.proofPhoto}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 w-full mt-2">
                                    <span className="font-semibold text-gray-900">Volunteer Notes: </span>
                                    {issue.volunteerNotes}
                                </div>

                                {issue.statusChange.to === 'resolved' && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 w-full flex items-start gap-2">
                                        <i className="fas fa-check-square text-lg flex-shrink-0 mt-0.5"></i>
                                        <span>
                                            <span className="font-bold">Resolution Update:</span> This issue has been marked as resolved. Approving will close the issue and notify the reporter.
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

function App() {
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues" element={<Issues />} /> 
            
            <Route path="/users-volunteers" element={<UsersVolunteers />} /> 
            <Route path="/admin-requests" element={<AdminRequests />} /> 
            <Route path="/issue-updates" element={<IssueUpdates />} /> 

            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} /> 
        )}
      </Routes>
    </Router>
  );
}

export default App;
