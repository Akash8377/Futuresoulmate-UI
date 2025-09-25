// components/BlockedUsersList.js
import React, { useState, useEffect } from "react";
import { getBlockedUsers, unblockUser } from "../../../../features/user/userApi";

const BlockedUsersList = ({ currentUser }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, [currentUser]);

  const fetchBlockedUsers = async () => {
    if (!currentUser?.user_id) return;
    
    try {
      setLoading(true);
      const result = await getBlockedUsers(currentUser.user_id);
      if (result.success) {
        setBlockedUsers(result.blockedUsers);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockedUserId) => {
    try {
      await unblockUser(currentUser.user_id, blockedUserId);
      setBlockedUsers(blockedUsers.filter(user => user.user_id !== blockedUserId));
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  if (loading) return <div>Loading blocked users...</div>;

  return (
    <div className="container mt-4">
      <h3>Blocked Users</h3>
      {blockedUsers.length === 0 ? (
        <p>No users are currently blocked.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Name</th>
                <th>Blocked Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blockedUsers.map(user => (
                <tr key={user.user_id}>
                  <td>{user.profileId}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img 
                        src={user.profile_image ? `${config.baseURL}/uploads/profiles/${user.profile_image}` : "/images/no-image-found.webp"}
                        alt={user.first_name}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleUnblock(user.user_id)}
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlockedUsersList;