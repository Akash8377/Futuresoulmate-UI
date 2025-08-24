import React from "react";
import AlertBox from "../AlertBox";

const MessageReceivedContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Message Received Alert">
    <div className="mb-3">
      <label className="form-label">Email Alert</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="messageReceived"
          id="daily8"
          checked={settings.messageReceived === 'daily'}
          onChange={() => onSettingChange('messageReceived', 'daily')}
        />
        <label className="form-check-label" htmlFor="daily8">
          Daily - A Digest off all responses received in a day
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="messageReceived"
          id="unsubscribe8"
          checked={settings.messageReceived === 'unsubscribe'}
          onChange={() => onSettingChange('messageReceived', 'unsubscribe')}
        />
        <label className="form-check-label" htmlFor="unsubscribe8">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default MessageReceivedContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const MessageReceivedContent = () => {
//   return (
//     <AlertBox title="Message Received Alert">
//     <div className="mb-3">
//       <label className="form-label">Email Alert</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert8"
//           id="daily8"
//         />
//         <label className="form-check-label" htmlFor="daily8">
//           Daily - A Digest off all responses recieved in a day
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert8"
//           id="unsubscribe8"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="unsubscribe8">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default MessageReceivedContent
