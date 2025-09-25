import React, { useState, useEffect } from 'react'

const Advertise = ({notifications}) => {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const handleToggleNotifications = () => {
    setShowAllNotifications((prev) => !prev);
  };
  const [pending, setPending] = useState([])


  useEffect(() => {
    // Filter searches based on isAdvanced prop
    if (notifications.length) {
      const pending = notifications.filter(n =>
        n.status === 'pending' || n.status === 'sent' || n.status ==='accepted'
      );
      setPending(pending);
    }
  }, [notifications]);

  const displayedNotification = showAllNotifications ? pending : pending.slice(0, 1);    
  return (
    <div>
       <div className="row g-4 mt-4">
          <div className="col-lg-4">
            <div className="card-lite p-0">
              <img src="images/limitedseat.jpg" className="w-100" />
              <div className="p-3">
                <div className="d-flex">
                  <div className="me-3 text-center">
                    <span className="d-block" style={{ backgroundColor: "#DF8525", color: "#fff", padding: "5px" }}>
                      Jul<br />21
                    </span>
                  </div>
                  <div>
                    <p className="small fw-semibold mb-1">Hindi Singles</p>
                    <p className="small mb-1"><i className="bi bi-clock"></i> 7:59 pm – 9:00 pm</p>
                    <p className="small text-muted mb-0"><i className="bi bi-people"></i> 999 interested • <span className="text-danger">5 Days Left</span></p>
                  </div>
                </div>
                <p className="small text-muted text-center mt-2">To attend this event download the app</p>
                <div className="d-flex justify-content-center gap-2">
                  <button type="button"><img src="images/gpaybutton.jpg" height="28" /></button>
                  <button type="button"><img src="images/applestroe.jpg" height="28" /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card-lite p-0">
              <img src="images/futureshadi.jpg" className="w-100" />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card-lite p-3">
              <h6 className="mb-3">
                <i className="fa fa-bell" aria-hidden="true"></i> {pending.length} Notifications {displayedNotification.length>0 && (<span className="notif-dot"></span>)}
              </h6>
              <div className="notif-card" id="noteBox">
                {displayedNotification.length > 0 && displayedNotification.map((notification, index)=>(
                <div className="notif-row" key={index}>
                  <div className="smallnew">
                    <a href="#" className="notif-name">{notification.message}</a>
                  <div className="text-muted mt-1">{new Date(notification.created_at).toLocaleDateString()}{" "}{new Date(notification.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
                ))}
                {pending.length > 1 && (<span className="view-toggle cursor-pointer text-blue-600" onClick={handleToggleNotifications}>
                    {showAllNotifications ? 'View Less' : 'View All'}
                </span>)}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Advertise
