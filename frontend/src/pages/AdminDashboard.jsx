import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, statsRes] = await Promise.all([
        axios.get('/api/admin/issues'),
        axios.get('/api/admin/stats')
      ]);
      setIssues(issuesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`/api/admin/issues/${id}/status`, { status: newStatus });
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards - Already Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
              <div key={stat.status} className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-gray-500 text-sm font-medium uppercase">{stat.status} Issues</h3>
                <p className="text-3xl font-bold mt-2">{stat.count}</p>
              </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW: Table (Hidden on Mobile) --- */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                    <div className="text-sm text-gray-500">{issue.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {issue.image_url ? (
                        <a
                            href={issue.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 text-xs font-semibold"
                        >
                          View Image
                        </a>
                    ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{issue.reporter_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <select
                        value={issue.status}
                        onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                        className="border rounded text-sm p-1"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW: Cards (Hidden on Desktop) --- */}
        <div className="md:hidden space-y-4">
          {issues.map((issue) => (
              <div key={issue.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{issue.title}</h3>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{issue.description}</p>

                <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
                  <p><span className="font-semibold">By:</span> {issue.reporter_name}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(issue.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {issue.image_url ? (
                      <a
                          href={issue.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium text-xs hover:underline"
                      >
                        View Image
                      </a>
                  ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                  )}

                  <select
                      value={issue.status}
                      onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                      className="border rounded text-sm p-1.5 bg-gray-50"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
          ))}
        </div>

      </div>
  );
};

export default AdminDashboard;