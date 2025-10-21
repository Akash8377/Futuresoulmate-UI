import React, { useState, useEffect } from 'react';

const ActivitySummary = ({ notifications, onEditClick, userInfo, recentVisitors }) => {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);

  useEffect(() => {
    if (notifications.length) {
      const pendingNotifications = notifications.filter(n => 
        n.status === 'pending' || n.status === 'sent'
      );
      const acceptedNotifications = notifications.filter(n => 
        n.status === 'accepted'
      );
      setPending(pendingNotifications);
      setAccepted(acceptedNotifications);
    }
  }, [notifications]);

  return (
    <div className="card-lite p-3">
      <h6>Your Activity Summary</h6>
      
      <ActivityTable 
        data={[
          { value: pending?.length || 0, label: 'Pending Invitations' },
          { value: accepted?.length || 0, label: 'Accepted Invitations' },
          { value: recentVisitors?.length , label: 'Recent Visitors', badge: 'NEW' }
        ]}
      />

      <ActivityTable 
        data={[
          { value: 0, label: 'Contacts Viewed' },
          { value: 0, label: 'Chats initiated' },
          { 
            customContent: userInfo.plan_status !== "active" && (
              <>
                <span className="text-primary fw-semibold">Only Premium Members</span> can avail these benefits{' '}
                <i className="fa fa-lock" aria-hidden="true" style={{ color: '#d61962' }}></i>
              </>
            )
          }
        ]}
      />

      <hr />
      <p className="small mb-0 cursor-pointer" onClick={onEditClick}>
        <strong>Complete Profile</strong>
      </p>
    </div>
  );
};

const ActivityTable = ({ data }) => (
  <table className="w-100 text-center act-table mb-2">
    <tbody>
      <tr className="head">
        {data.map((item, index) => (
          <td key={index} style={{ width: '33.33%' }}>
            {item.customContent || (
              <>
                {item.value}
                {item.badge && (
                  <span className="badge align-top small" style={{ backgroundColor: '#cef8e5' }}>
                    {item.badge}
                  </span>
                )}
                <br />
                <span className="fw-normal text-muted small">{item.label}</span>
              </>
            )}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

export default ActivitySummary;