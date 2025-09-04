import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../../../config';
import { connectSocket, getSocket } from '../../../../utils/socket';
import { calculateAge } from '../../../../utils/helpers';

const ChatBox = ({showChatBox = null, setShowChatBox }) => {
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const currentUserId = user?.id ? String(user.id) : null;
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === "Bride" ? "Groom" : "Bride";

  const [allUsers, setAllUsers] = useState([]);
  const [alertItems, setAlertItems] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('tab-active');
  const [showChatbox, setShowChatbox] = useState(false);
  const [showHoverBox, setShowHoverBox] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [hoverItem, setHoverItem] = useState({});

  // Store conversations with JSON messages
  const [conversations, setConversations] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

useEffect(() => {
  if (showChatBox) {
    setIsMinimized(false);
  }
}, [showChatBox]);

  const fetchFilteredProfiles = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/inbox/chat-users`,
        {
          params: {
            user_id: user.id,
            looking_for: searchFor,
          },
        }
      );
      const users = response.data.users || [];
      // console.log("Users: ",users)
      setAllUsers(users);
      setAlertItems(users.filter(u => u.connectionRequest === true));
      setActiveUsers(users.filter(u => u.online === true));
      setChatUsers(users.filter(u => u.lastMessage !== null));
    } catch (error) {
      console.error("Error fetching profiles", error);
    }
  };

  useEffect(() => {
    if (user?.id && searchFor) {
      console.log("fetchFilteredProfiles() with user?.id ",user?.id," & searchFor ",searchFor)
      fetchFilteredProfiles();
    }
  }, [user?.id, searchFor]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const openChatbox = (user) => {
    setSelectedUser(user);
    setShowChatbox(true);
  };

  const closeChatbox = () => {
    setShowChatbox(false);
  };

  const toggleHoverBox = (show, userItem = {}) => {
    setHoverItem(userItem);
    setShowHoverBox(show);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if(showChatBox !== null){
      setShowChatBox();
    }
  };

 // Connect socket when component mounts
// Connect socket and set up listeners
  useEffect(() => {
    if (!token) {
      console.log("User token not available");
      return;
    }

    console.log("Initializing socket connection...");
    connectSocket(token);
    socketRef.current = getSocket();

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("Socket connected, setting up listeners...");
      
      // Join user's personal room
      if (currentUserId) {
        socket.emit('join-user-room', { userId: currentUserId });
        console.log(`Joined user room for ${currentUserId}`);
      }

      // Set up message listener
      socket.on('receive-message', handleReceiveMessage);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Initial connection check
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('receive-message', handleReceiveMessage);
      
      if (socket.connected) {
        console.log("Disconnecting socket...");
        socket.disconnect();
      }
    };
  }, [token, currentUserId]);

  const fetchMessageHistory = async () => {
    if (!selectedUser || !currentUserId) return;
    
    try {
      const response = await axios.get(
        `${config.baseURL}/api/messages/history`,
        {
          params: {
            user1: currentUserId,
            user2: selectedUser.id
          }
        }
      );
      
      // Parse JSON messages if needed
      const messages = typeof response.data.messages === 'string' 
        ? JSON.parse(response.data.messages) 
        : response.data.messages;
      
      setConversations(prev => ({
        ...prev,
        [selectedUser.id]: messages || []
      }));
    } catch (error) {
      console.error("Error fetching message history", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      console.log("fetching message history for selected user")
      fetchMessageHistory();
    }
  }, [selectedUser, currentUserId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations[selectedUser?.id]]);

 // Handle incoming messages with proper ID comparison
  const handleReceiveMessage = useCallback((msg) => {
  if (!msg || !msg.sender_id || !msg.receiver_id) return;
  
  // Convert all IDs to strings for consistent comparison
  const senderId = String(msg.sender_id);
  const receiverId = String(msg.receiver_id);
  const currentUserIdStr = String(currentUserId);
  
  // Determine conversation partner
  const partnerId = senderId === currentUserIdStr ? receiverId : senderId;
  const isCurrentUserSender = senderId === currentUserIdStr;
  
  // Update conversations state
  setConversations(prev => {
    const existingMessages = prev[partnerId] || [];
    
    // Check if message already exists
    const messageExists = existingMessages.some(
      m => m.id === msg.id || (m.sent_at === msg.sent_at && m.content === msg.content)
    );
    
    if (messageExists) return prev;
    
    const updatedConversations = {
      ...prev,
      [partnerId]: [...existingMessages, msg]
    };
    
    return updatedConversations;
  });
  
  // Update chatUsers state with the new message
  setChatUsers(prevUsers => {
    return prevUsers.map(user => {
      // Check if this message belongs to this user's conversation
      if (String(user.id) === partnerId) {
        return {
          ...user,
          lastMessage: {
            content: msg.content,
            sent_at: msg.sent_at,
            is_sender: isCurrentUserSender
          }
        };
      }
      return user;
    });
  });
  
  // If message is for currently open chat, scroll to bottom
  if (selectedUser && String(selectedUser.id) === partnerId) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }
}, [currentUserId, selectedUser]);

  // Socket event listeners
  useEffect(() => {
    if (!socketRef.current) {
      console.log("handel received message socketRef.current value ", socketRef.current)
      return};
    console.log("socketRef.current.on")
    socketRef.current.on('receive-message', handleReceiveMessage);
    
    return () => {
      if (socketRef.current) {
        console.log("socketRef.current.off")
        socketRef.current.off('receive-message', handleReceiveMessage);
      }
    };
  }, [handleReceiveMessage]);
// Join room when selected user changes
  // Handle joining conversation rooms when selectedUser changes
  useEffect(() => {
    if (!socketRef.current?.connected || !selectedUser) {
      console.log("Socket not ready or no selected user");
      return;
    }

    const conversationId = getConversationId(currentUserId, selectedUser.id);
    console.log(`Joining conversation room: ${conversationId}`);
    
    socketRef.current.emit('join-conversation', { conversationId });

    return () => {
      if (socketRef.current?.connected) {
        console.log(`Leaving conversation room: ${conversationId}`);
        socketRef.current.emit('leave-conversation', { conversationId });
      }
    };
  }, [selectedUser, currentUserId]);


    // Helper function to generate consistent conversation IDs
  const getConversationId = (userId1, userId2) => {
    const id1 = parseInt(userId1);
    const id2 = parseInt(userId2);
    return `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;
  };

  const sendMessage = async () => {
  if (!inputMessage.trim() || !selectedUser || !currentUserId) return;

  try {
    const response = await axios.post(`${config.baseURL}/api/messages/send`, {
      sender_id: Number(currentUserId),
      receiver_id: selectedUser.id,
      content: inputMessage.trim()
    });

    const newMessage = response.data.message;
    
    // Update conversations state
    // setConversations(prev => ({
    //   ...prev,
    //   [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    // }));
    
    // Update chatUsers state
    setChatUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            lastMessage: {
              content: newMessage.content,
              sent_at: newMessage.sent_at,
              is_sender: true
            }
          };
        }
        return user;
      });
    });
    
    setInputMessage('');
  } catch (error) {
    console.error("Error sending message", error);
  }
};

  const currentMessages = selectedUser ? conversations[selectedUser.id] || [] : [];

  return (
    <div className="col-md-3">
      <div className="chat-box">
        <div className="header">
          <div className="status comment">
            <i className="fa fa-comments-o" aria-hidden="true"></i>
            I am Online ▼
          </div>
          <div className="status">
            <i className="fa fa-volume-up" aria-hidden="true"></i>
          </div>
          <div className="drop-box" onClick={toggleMinimize}>
            <i className={`fa ${isMinimized ? 'fa-plus' : 'fa-minus'} cursor-pointer`} aria-hidden="true"></i>
          </div>
        </div>
        {!isMinimized && (
			<div className="tab-container">
            <input type="radio" name="tab" id="tab-active" checked={activeTab === 'tab-active'} onChange={() => handleTabChange('tab-active')} />
            <input type="radio" name="tab" id="tab-chats" checked={activeTab === 'tab-chats'} onChange={() => handleTabChange('tab-chats')} />
            <input type="radio" name="tab" id="tab-alerts" checked={activeTab === 'tab-alerts'} onChange={() => handleTabChange('tab-alerts')} />

            <div className="tab-content content">
              {alertItems.map((item, index) => (
                <div id="alerts" key={item.id} className="chat-box-tab" style={{ display: activeTab === 'tab-alerts' ? 'block' : 'none' }}>
                  <div className="online-box">
                    <div className="user-item" key={index}>
                      <img src={`${config.baseURL}/uploads/profiles/${item.profile_image}`} alt={item.name} className="user-img" />
                      <div className="user-info">
                        <div><strong>{item.first_name}{" "}{item.last_name}</strong> {" "}
                        {/* {item.notification_message} */}
                        wants to connect with you
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

             {chatUsers.map((item, index) => (
                <div id="chats" className="chat-box-tab" style={{ display: activeTab === 'tab-chats' ? 'block' : 'none' }} key={index}>
                  <div className="online-box">
                    <div className={`chat-item ${item.online === false ? "offline" : ""}`} key={index}>
                      <div 
                        className="chat-info" 
                      >
                        <img 
                          src={item.profile_image ? `${config.baseURL}/uploads/profiles/${item.profile_image}` : "images/womenpic.jpg"} 
                          className="chat-img" 
                          alt={item.name} 
                        />
                        <div className="chat-text">
                          <strong>{item.first_name}</strong>
                          <div className="text-truncate" style={{ maxWidth: '150px' }}>
                            <small className="text-muted">
                              {item.lastMessage ? (
                                <>
                                  {item.lastMessage.is_sender ? "You: " : ""}
                                  {item.lastMessage.content}
                                </>
                              ) : "Start a conversation"}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="msg-date">
                          {item.lastMessage ? (
                            new Date(item.lastMessage.sent_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          ) : ''}
                        </div>
                        {item.online && <div className="online-dot"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div id="active" className="chat-box-tab" style={{ display: activeTab === 'tab-active' ? 'block' : 'none' }}>
                <div className="online-box">
                  <div className="user-list-chat-box">
                    <div className="p-2 fw-bold border-bottom">My Matches ({activeUsers.length})</div>
                    {allUsers.map((userItem, index) => (
                      <div
                        className={`user-item ${userItem.online === false ? "offline":""}`}
                        key={userItem.id}
                        onClick={() => openChatbox(userItem)}
                        onMouseEnter={() => toggleHoverBox(true, userItem)}
                        onMouseLeave={() => toggleHoverBox(false)}
                      >
                        <img src={userItem.profile_image ? `${config.baseURL}/uploads/profiles/${userItem.profile_image}` : "images/womenpic.jpg"} alt={userItem.name} />
                        <span>{userItem.first_name} {userItem.last_name}</span>
                        {userItem.online && (<div className="online-dot"></div>)}
                      </div>
                    ))}
                  </div>
                </div>

                {showChatbox && (
              <div className="chatbox" id="chatbox">
                <div className="chat-header d-flex justify-content-between align-items-center">
                  <span>{`${selectedUser?.first_name} ${selectedUser?.last_name}`  || 'Chat'}</span>
                  <span className='d-flex align-items-center gap-2'>
                    {selectedUser.online ? "Online" : "Offline"} 
                    <div className={selectedUser.online ? "online-dot" : "offline-dot"}></div>
                  </span>
                  <button className="btn-close btn-close-white" onClick={closeChatbox}></button>
                </div>
                <div className="chat-body">
                  <div className="chat-messages">
                    {currentMessages.map((msg, idx) => (
                      <div key={msg.id || idx} className={`${String(msg.sender_id) === currentUserId ? 'sent' : 'received'}`}>
                        <div className="chat-msg">
                          {msg.content}
                          <div className="text-end text-muted" style={{ fontSize: "11px" }}>
                            {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="chat-footer d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type a message"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="btn" onClick={sendMessage}>➤</button>
                </div>
              </div>
            )}

                {showHoverBox && (
                  <div id="himanshi-hover-box" className="hover-box">
                    <div className="chat-hover" id="chatHover">
                      <div className="profile-card">
                        <div className="profile-left">
                          <img src={hoverItem.profile_image ? `${config.baseURL}/uploads/profiles/${hoverItem.profile_image}` : "images/womenpic.jpg"} alt={hoverItem.name} className="hover-box-profile-img" />
                          {/* <button className="photo-btn">Request a Photo</button> */}
                        </div>
                        <div className="profile-right">
                          <h5 className="name">{hoverItem?.first_name} {hoverItem?.last_name}</h5>
                          <table className="profile-details">
                            <tbody>
                              <tr><td>Age / Height</td><td>: {calculateAge(hoverItem?.birth_year,hoverItem?.birth_month,hoverItem?.birth_day)}, {hoverItem?.height}</td></tr>
                              <tr><td>Religion/Community</td><td>: {hoverItem?.religion}, {hoverItem?.community}</td></tr>
                              <tr><td>Language</td><td>: {hoverItem?.mother_tongue}</td></tr>
                              <tr><td>Profession</td><td>: {hoverItem?.profession}</td></tr>
                              <tr><td>Location</td><td>: {hoverItem?.city}, {hoverItem?.country}</td></tr>
                            </tbody>
                          </table>
                          {/* <div className="profile-actions">
                            <button className="accept-btn">Accept</button>
                            <button className="decline-btn">Decline</button>
                          </div> */}
                          {/* <div className="upgrade-text">
                            <a href="#">Upgrade Now to start Chatting</a>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="tabs">
              <label htmlFor="tab-active" onClick={() => handleTabChange('tab-active')}>
                <i className="fa fa-bell-o" aria-hidden="true"></i> Active
              </label>
              <label htmlFor="tab-chats" onClick={() => handleTabChange('tab-chats')}>
                <i className="fa fa-comments" aria-hidden="true"></i> Chats
              </label>
              <label htmlFor="tab-alerts" onClick={() => handleTabChange('tab-alerts')}>
                <i className="fa fa-bell-o" aria-hidden="true"></i> Alerts
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;