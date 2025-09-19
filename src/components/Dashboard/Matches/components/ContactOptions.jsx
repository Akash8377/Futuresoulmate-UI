import { useSelector } from "react-redux";

const ContactOptions = ({profile, chatBoxOpen}) => {
  const phone = profile.phone || profile.receiver_phone
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = () =>{
    console.log("phone", phone)
    if(phone){
      window.open(`https://wa.me/${phone}`, '_blank')
    }
  }

  return(
  <div className="text-center">
    {userInfo.plan_status === "active"?"":(<p className="upgrade-text mb-2">
      <span className="text-primary">Upgrade</span> to<br />
      Contact her directly
    </p>)}
    <button className="btn btn-outline-info contact-btn mb-2 w-100" onClick={handleCall}>
      <i className="fa fa-phone me-1" aria-hidden="true" ></i> Call
    </button>
    <button className="btn btn-outline-success contact-btn mb-2 w-100" onClick={handleWhatsApp}>
      <i className="fa fa-whatsapp me-1" aria-hidden="true"  ></i> WhatsApp
    </button>
    <button className="btn btn-outline-primary contact-btn w-100" onClick={()=>chatBoxOpen()}>
      <i className="fa fa-commenting-o me-1" aria-hidden="true"></i> Shaadi Chat
    </button>
  </div>
  )
}

export default ContactOptions;