import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUsersByLookingForQuery } from '../dashtabcomponents/slice/matchSlice';
import Header from '../Header';
import { io } from 'socket.io-client';
import config from '../../../config';
import './MessageInbox.css';

let socket = null;

const MessageInbox = () => {
  const user = useSelector((state) => state.user.userInfo);
  const currentUserId = user?.id;

  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === 'Bride' ? 'Groom' : 'Bride';

  const { data } = useGetUsersByLookingForQuery(searchFor);
  const [visitors, setVisitors] = useState([]);
  const [visitorOrder, setVisitorOrder] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [lastSeenMap, setLastSeenMap] = useState({});
  const [messagesMap, setMessagesMap] = useState({});
  const [unreadCountMap, setUnreadCountMap] = useState({});

  useEffect(() => {
    if (data?.success && Array.isArray(data.users)) {
      setVisitors(data.users);
      setVisitorOrder(data.users.map((u) => u.user_id));
    }
  }, [data]);

  useEffect(() => {
    if (!currentUserId) return;

    socket = io(config.baseURL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('user-online', currentUserId);
    });

    socket.on('update-online-users', ({ online, lastSeen }) => {
      setOnlineUsers(online);
      setLastSeenMap(lastSeen || {});
    });

    socket.on('receive-message', ({ from, to, message, time }) => {
      if (from === currentUserId) return;

      // Add new message to message map
      setMessagesMap((prev) => {
        const existingMessages = prev[from] || [];
        return {
          ...prev,
          [from]: [...existingMessages, { from, to, message, time }],
        };
      });

      // Update unread count
      setUnreadCountMap((prev) => {
        if (selectedUser?.user_id === from) return prev;
        return {
          ...prev,
          [from]: (prev[from] || 0) + 1,
        };
      });

      // Move user to top of the list
      setVisitorOrder((prev) => {
        const filtered = prev.filter((id) => id !== from);
        return [from, ...filtered];
      });
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    if (selectedUser?.user_id) {
      setUnreadCountMap((prev) => {
        const updated = { ...prev };
        delete updated[selectedUser.user_id];
        return updated;
      });
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      const payload = {
        from: currentUserId,
        to: selectedUser.user_id,
        message: messageInput,
      };

      if (socket && socket.connected) {
        socket.emit('send-message', payload);
      }

      setMessagesMap((prev) => {
        const existingMessages = prev[selectedUser.user_id] || [];
        return {
          ...prev,
          [selectedUser.user_id]: [
            ...existingMessages,
            {
              from: currentUserId,
              to: selectedUser.user_id,
              message: messageInput,
              time: new Date().toLocaleString(),
            },
          ],
        };
      });

      setMessageInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sortedVisitors = visitorOrder
    .map((id) => visitors.find((u) => u.user_id === id))
    .filter(Boolean);

  return (
    <>
      <Header />
      <div className="chat-wrapper">
        {/* Left Sidebar - Online Users */}
        <div className="user-list">
          <h4>Online Users</h4>
          {sortedVisitors.map((u) => (
            <div
              className="user-item"
              key={u.user_id}
              onClick={() => setSelectedUser(u)}
              style={{
                background:
                  selectedUser?.user_id === u.user_id
                    ? '#f2f2f2'
                    : unreadCountMap[u.user_id]
                    ? '#e6f7ff'
                    : 'transparent',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <img
                src={`${config.baseURL}/uploads/profiles/${u.profile_image}`}
                alt={u.first_name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">
                  {u.first_name}
                  {unreadCountMap[u.user_id] && (
                    <span className="unread-badge">{unreadCountMap[u.user_id]}</span>
                  )}
                </div>
                <div
                  className={`user-status ${
                    onlineUsers.includes(u.user_id) ? 'online' : 'offline'
                  }`}
                >
                  {onlineUsers.includes(u.user_id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Chat Panel */}
        <div className="chat-container">
          {selectedUser ? (
            <>
              <div className="contact-bar">
                <div className="display-pic">
                  <img
                    src={
                      selectedUser?.profile_image
                        ? `${config.baseURL}/uploads/profiles/${selectedUser.profile_image}`
                        : 'images/userimage.png'
                    }
                    className="user-image"
                    alt={selectedUser?.first_name}
                  />
                </div>
                <div className="contact-info">
                  <div className="contact-name">{selectedUser.first_name}</div>
                  <div className="contact-status">
                    {onlineUsers.includes(selectedUser.user_id)
                      ? 'Online now'
                      : `Last seen: ${lastSeenMap[selectedUser.user_id] || 'Unknown'}`}
                  </div>
                </div>
              </div>

              <div className="messages" id="chat">
                {(messagesMap[selectedUser.user_id] || []).map((msg, index) => (
                  <div
                    key={index}
                    className={`message-row ${
                      msg.from === currentUserId ? 'right' : 'left'
                    }`}
                  >
                    <div
                      className={`message ${
                        msg.from === currentUserId ? 'stark' : 'parker'
                      }`}
                    >
                      <div className="message-text">{msg.message}</div>
                      <div className="message-meta">
                        {msg.from === currentUserId ? (
                          <small className="from-me">from me</small>
                        ) : (
                          <small className="from-other">
                            {selectedUser.first_name}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <label htmlFor="photo-upload">
                  <i className="far fa-laugh-beam emoji-icon"></i>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <input
                  type="text"
                  className="input-box"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here!"
                />
                <button className="send-button" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="select-user-msg">Select a user to start chatting</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageInbox;
