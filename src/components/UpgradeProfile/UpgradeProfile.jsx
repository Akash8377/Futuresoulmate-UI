// pages/UpgradeProfile.js
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import PlanCard from './PlanCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import config from '../../config';
import { toast } from '../../components/Common/Toast';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';

const stripePromise = loadStripe(config.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Define plan hierarchy (lower index = lower plan)
const PLAN_HIERARCHY = ['basic', 'standard', 'premium', 'enterprise'];

const UpgradeProfile = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { userInfo,token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    fetchAvailablePlans();
    fetchUserCurrentSubscription();
  }, []);

  useEffect(() => {
    if (checkoutSession && checkoutSession.id) {
      // Redirect to Stripe Checkout
      stripePromise.then(stripe => {
        stripe.redirectToCheckout({
          sessionId: checkoutSession.id,
        }).then((result) => {
          if (result.error) {
            console.error('Stripe checkout error:', result.error);
            setError(result.error.message);
          }
        });
      });
    }
  }, [checkoutSession]);

  // Function to get plan level in hierarchy
  const getPlanLevel = (planName) => {
    const normalizedName = planName.toLowerCase();
    return PLAN_HIERARCHY.findIndex(plan => normalizedName.includes(plan));
  };

  // Check if a plan should be disabled
  const isPlanDisabled = (plan) => {
    if (!currentSubscription) return false;
    
    const currentPlanLevel = getPlanLevel(currentSubscription.plan_name);
    const targetPlanLevel = getPlanLevel(plan.name);
    
    // Disable if target plan is lower than current plan
    return targetPlanLevel < currentPlanLevel;
  };

  const fetchAvailablePlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.baseURL}/api/subscription/plans/available`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log("Available plans", response)
      setPlans(response.data.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setError(error.response?.data?.message || 'Failed to fetch available plans');
      toast.error(error.response?.data?.message || 'Failed to fetch available plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCurrentSubscription = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${config.baseURL}/api/subscription/user/subscription/current`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log("Current Subscription Response:", response.data);
      if(response?.data?.success){
        setCurrentSubscription(response?.data?.data);
        const updatedUserInfo = {...userInfo,
          plan_status: response?.data?.data?.status,
          plan_name: response?.data?.data?.plan_name,
          start_date: response?.data?.data?.start_date,
          end_date: response?.data?.data?.end_date,
          plan_price: response?.data?.data?.plan_price,
          stripe_payment_intent_id: response?.data?.data?.stripe_payment_intent_id,
          stripe_subscription_id: response?.data?.data?.stripe_subscription_id,
        }
        dispatch(setUser({
          userInfo: updatedUserInfo,
          token: token,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch current subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${config.baseURL}/api/subscription/stripe/create-checkout-session`,
        { planId },
        {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        }
      );
      setCheckoutSession(response.data.data);
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setError(error.response?.data?.message || 'Failed to create checkout session');
      toast.error(error.response?.data?.message || 'Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const createPortalSession = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${config.baseURL}/api/subscription/stripe/create-portal-session`,
        {},
        {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        }
      );
      
      // Redirect to Stripe Customer Portal
      window.location.href = response.data.data.url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      setError(error.response?.data?.message || 'Failed to create portal session');
      toast.error(error.response?.data?.message || 'Failed to create portal session');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    createCheckoutSession(planId);
  };

  const handleManageSubscription = () => {
    createPortalSession();
  };

  const clearError = () => {
    setError(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !plans.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-profile-container">
      <div className="container">
        <div className="upgrade-header">
          <h1 className="upgrade-title">Upgrade Your Account</h1>
          <p className="upgrade-subtitle">
            Choose the plan that's right for you and unlock premium features
          </p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
            <button
              onClick={clearError}
              className="error-close-btn"
            >
              ×
            </button>
          </div>
        )}

        {/* Current Subscription Info */}
        {currentSubscription && (
          <div className="current-subscription-card">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <h2 className="current-subscription-title">Your Current Plan</h2>
                <p className="current-plan-name">{currentSubscription.plan_name}</p>
                <p className="text-muted1">
                  {currentSubscription.status === 'active' 
                    ? `Renews on ${formatDate(currentSubscription.end_date)}`
                    : `Expired on ${formatDate(currentSubscription.end_date)}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentSubscription}
              onSelect={handlePlanSelect}
              loading={loading}
              disabled={isPlanDisabled(plan)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeProfile;



// // pages/UpgradeProfile.js
// import React, { useEffect, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import axios from 'axios';
// import PlanCard from './PlanCard';
// import LoadingSpinner from '../Common/LoadingSpinner';
// import config from '../../config';
// import { toast } from '../../components/Common/Toast';
// import { useSelector, useDispatch } from 'react-redux';
// import { setUser } from '../../features/user/userSlice';

// const stripePromise = loadStripe(config.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// const UpgradeProfile = () => {
//   const [plans, setPlans] = useState([]);
//   const [currentSubscription, setCurrentSubscription] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [checkoutSession, setCheckoutSession] = useState(null);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const { userInfo,token } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     fetchAvailablePlans();
//     fetchUserCurrentSubscription();
//   }, []);

//   useEffect(() => {
//     if (checkoutSession && checkoutSession.id) {
//       // Redirect to Stripe Checkout
//       stripePromise.then(stripe => {
//         stripe.redirectToCheckout({
//           sessionId: checkoutSession.id,
//         }).then((result) => {
//           if (result.error) {
//             console.error('Stripe checkout error:', result.error);
//             setError(result.error.message);
//           }
//         });
//       });
//     }
//   }, [checkoutSession]);

//   const fetchAvailablePlans = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${config.baseURL}/api/subscription/plans/available`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//       });
//       console.log("Available plans", response)
//       setPlans(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch plans:', error);
//       setError(error.response?.data?.message || 'Failed to fetch available plans');
//       toast.error(error.response?.data?.message || 'Failed to fetch available plans');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserCurrentSubscription = async () => {
//     try {
//       setLoading(true);
      
//       const response = await axios.get(`${config.baseURL}/api/subscription/user/subscription/current`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//       });
//       console.log("Current Subscription Response:", response.data); // Debugging line
//       if(response?.data?.success){
//         setCurrentSubscription(response?.data?.data);
//         const updatedUserInfo = {...userInfo,
//           plan_status: response?.data?.data?.status,
//           plan_name: response?.data?.data?.plan_name,
//           start_date: response?.data?.data?.start_date,
//           end_date: response?.data?.data?.end_date,
//           plan_price: response?.data?.data?.plan_price,
//           stripe_payment_intent_id: response?.data?.data?.stripe_payment_intent_id,
//           stripe_subscription_id: response?.data?.data?.stripe_subscription_id,
//         }
//         dispatch(setUser({
//           userInfo: updatedUserInfo,
//           token: token,
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to fetch current subscription:', error);
//       // It's okay if this fails - user might not have a subscription
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createCheckoutSession = async (planId) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.post(
//         `${config.baseURL}/api/subscription/stripe/create-checkout-session`,
//         { planId },
//         {
//           headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         }
//       );
//       setCheckoutSession(response.data.data);
//     } catch (error) {
//       console.error('Failed to create checkout session:', error);
//       setError(error.response?.data?.message || 'Failed to create checkout session');
//       toast.error(error.response?.data?.message || 'Failed to create checkout session');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPortalSession = async () => {
//     try {
//       setLoading(true);
      
//       const response = await axios.post(
//         `${config.baseURL}/api/subscription/stripe/create-portal-session`,
//         {},
//         {
//           headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         }
//       );
      
//       // Redirect to Stripe Customer Portal
//       window.location.href = response.data.data.url;
//     } catch (error) {
//       console.error('Failed to create portal session:', error);
//       setError(error.response?.data?.message || 'Failed to create portal session');
//       toast.error(error.response?.data?.message || 'Failed to create portal session');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlanSelect = (planId) => {
//     setSelectedPlan(planId);
//     createCheckoutSession(planId);
//   };

//   const handleManageSubscription = () => {
//     createPortalSession();
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   if (loading && !plans.length) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <LoadingSpinner />
//         </div>
//       </div>
//     );
//   }

//  return (
//     <div className="upgrade-profile-container">
//       <div className="container">
//         <div className="upgrade-header">
//           <h1 className="upgrade-title">Upgrade Your Account</h1>
//           <p className="upgrade-subtitle">
//             Choose the plan that's right for you and unlock premium features
//           </p>
//         </div>

//         {error && (
//           <div className="error-alert">
//             {error}
//             <button
//               onClick={clearError}
//               className="error-close-btn"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Current Subscription Info */}
//         {currentSubscription && (
//           <div className="current-subscription-card">
          
//             <div className="d-flex flex-wrap align-items-center justify-content-between">
//               <div>
//                   <h2 className="current-subscription-title">Your Current Plan</h2>
//                 <p className="current-plan-name">{currentSubscription.plan_name}</p>
//                 <p className="text-muted1">
//                   {currentSubscription.status === 'active' 
//                     ? `Renews on ${formatDate(currentSubscription.end_date)}`
//                     : `Expired on ${formatDate(currentSubscription.end_date)}`
//                   }
//                 </p>
//               </div>
//               {/* <button
//                 onClick={handleManageSubscription}
//                 className="manage-subscription-btn"
//               >
//                 Manage Subscription
//               </button> */}
//             </div>
//           </div>
//         )}

//         {/* Plans Grid */}
//         <div className="plans-grid">
//           {plans.map((plan) => (
//             <PlanCard
//               key={plan.id}
//               plan={plan}
//               currentPlan={currentSubscription}
//               onSelect={handlePlanSelect}
//               loading={loading}
//             />
//           ))}
//         </div>

//         {/* FAQ Section */}
//         {/* <div className="faq-section">
//           <h2 className="faq-title">Frequently Asked Questions</h2>
//           <div className="faq-list">
//             <div className="faq-item mb-3">
//               <h3 className="faq-question">Can I change my plan anytime?</h3>
//               <p className="faq-answer">
//                 Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll immediately get access to the new features. When downgrading, the changes will take effect at the end of your current billing cycle.
//               </p>
//             </div>
//             <div className="faq-item mb-3">
//               <h3 className="faq-question">What payment methods do you accept?</h3>
//               <p className="faq-answer">
//                 We accept all major credit cards through our secure Stripe payment processor. Your payment information is encrypted and never stored on our servers.
//               </p>
//             </div>
//             <div className="faq-item">
//               <h3 className="faq-question">Can I cancel my subscription?</h3>
//               <p className="faq-answer">
//                 Yes, you can cancel your subscription at any time from your account settings. After cancellation, you'll continue to have access to premium features until the end of your current billing period.
//               </p>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default UpgradeProfile;