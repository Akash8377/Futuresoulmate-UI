import React from 'react';

const PlanCard = ({ plan, currentPlan, onSelect, loading, disabled }) => {
  const isCurrentPlan = currentPlan && currentPlan.plan_id === plan.id;
  // Set Standard plan as popular instead of Pro/Premium
  const isPopular = plan.name.toLowerCase().includes('standard');
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  const getButtonClass = () => {
    if (isCurrentPlan) return 'upgrade-btn upgrade-btn-current';
    if (isPopular) return 'upgrade-btn upgrade-btn-popular';
    return 'upgrade-btn upgrade-btn-regular';
  };

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan';
    if (disabled) return 'Not Available';
    return 'Upgrade Now';
  };

  return (
    <div className={`plan-card ${isPopular ? 'plan-card-popular' : ''} ${isCurrentPlan ? 'plan-card-current' : ''} ${disabled ? 'plan-card-disabled' : ''}`} title={disabled ? "Lower plans are not available for upgrade":""}>
      {isPopular && (
        <div className="popular-badge">
          Most Popular
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="current-badge">
          Current Plan
        </div>
      )}
      
      <h3 className="plan-name">{plan.name}</h3>
      
      <div className="plan-price">
        <span className="price-amount">{formatPrice(plan.price)}</span>
        <span className="price-interval">/month</span>
      </div>
      
      <div 
        className="plan-description"
        dangerouslySetInnerHTML={createMarkup(plan.description)}
      />
      
      <button
        onClick={() => !disabled && onSelect(plan.id)}
        disabled={isCurrentPlan || loading || disabled}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>
      
      {/* {disabled && (
        <div className="disabled-message">
          Lower plans are not available for upgrade
        </div>
      )} */}
    </div>
  );
};

export default PlanCard;



// import React from 'react';

// const PlanCard = ({ plan, currentPlan, onSelect, loading }) => {
//   const isCurrentPlan = currentPlan && currentPlan.plan_id === plan.id;
//   const isPopular = plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('premium');
  
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(price);
//   };

//   const createMarkup = (htmlContent) => {
//     return { __html: htmlContent };
//   };

//   const getButtonClass = () => {
//     if (isCurrentPlan) return 'upgrade-btn upgrade-btn-current';
//     if (isPopular) return 'upgrade-btn upgrade-btn-popular';
//     return 'upgrade-btn upgrade-btn-regular';
//   };

//   return (
//     <div className={`plan-card ${isPopular ? 'plan-card-popular' : ''} ${isCurrentPlan ? 'plan-card-current' : ''}`}>
//       {isPopular && (
//         <div className="popular-badge">
//           Most Popular
//         </div>
//       )}
      
//       {isCurrentPlan && (
//         <div className="current-badge">
//           Current Plan
//         </div>
//       )}
      
//       <h3 className="plan-name">{plan.name}</h3>
      
//       <div className="plan-price">
//         <span className="price-amount">{formatPrice(plan.price)}</span>
//         <span className="price-interval">/month</span>
//       </div>
      
//       <div 
//         className="plan-description"
//         dangerouslySetInnerHTML={createMarkup(plan.description)}
//       />
      
//       <button
//         onClick={() => onSelect(plan.id)}
//         disabled={isCurrentPlan || loading}
//         className={getButtonClass()}
//       >
//         {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
//       </button>
//     </div>
//   );
// };

// export default PlanCard;