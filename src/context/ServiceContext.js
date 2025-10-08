import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from '../config';
const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const token = useSelector((state) => state.user.token);
  const [serviceData, setServiceData] = useState({
    used: 0,
    uses_left: 0,
    max_uses: 0,
    plan_name: null,
    loading: true,
    service_found: false
  });

  const fetchServiceStatus = async () => {
    try {
      setServiceData(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`${config.baseURL}/api/profile/service/status?service_name=Shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (data.success) {
        const serviceInfo = data.services?.Shortlist || data.services;
        
        if (serviceInfo) {
          setServiceData({
            used: serviceInfo.used || 0,
            uses_left: serviceInfo.uses_left || 0,
            max_uses: serviceInfo.max_uses || 0,
            plan_name: data.plan_name,
            loading: false,
            service_found: true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching service status:', error);
      setServiceData(prev => ({ ...prev, loading: false }));
    }
  };

  const updateServiceUsage = (newUsed, newUsesLeft) => {
    setServiceData(prev => ({
      ...prev,
      used: newUsed,
      uses_left: newUsesLeft
    }));
  };

  useEffect(() => {
    fetchServiceStatus();
  }, []);

  return (
    <ServiceContext.Provider value={{ serviceData, updateServiceUsage, refetchServiceStatus: fetchServiceStatus }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};