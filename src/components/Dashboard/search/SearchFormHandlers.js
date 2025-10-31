import { useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../Common/Toast';

const useSearchFormHandlers = (isAdvanced = false) => {
  const { userInfo, token } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  // Common initial values
  const commonInitialValues = {
    profileId: '',
    ageFrom: '20',
    ageTo: '70',
    heightFrom: '5ft 0in',
    heightTo: '5ft 11in',
    maritalStatus: null,
    religion: null,
    motherTongue: null,
    community: null,
    country: null,
    state: null,
    visibleToAll: true,
    protectedPhoto: false,
    filterMeOut: true,
    iFilteredOut: false
  };

  const initialFormData = {
    ...commonInitialValues,
    // Advanced Search specific fields
    advanceProfileId: '',
    advanceAgeFrom: '20',
    advanceAgeTo: '70',
    advanceHeightFrom: '5ft 0in',
    advanceHeightTo: '5ft 11in',
    advanceMaritalStatus: null,
    advanceReligion: null,
    advanceMotherTongue: null,
    advanceCommunity: null,
    advanceCountry: null,
    advanceState: null,
    advanceResidencyStatus: null,
    advanceCountryGrew: null,
    advanceQualification: null,
    advanceEducationArea: null,
    advanceWorkingWith: null,
    advanceProfessionArea: null,
    advanceAnnualIncome: '',
    advanceDiet: [],
    advanceKeywords: '',
    // advanceChatAvailable: false,
    advanceVisibleToAll: true,
    advanceProtectedPhoto: false,
    advanceProfileManagedBy: [],
    advanceFilterMeOut: true,
    advanceIFilteredOut: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Generic handler for input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for react-select changes
  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
  };

  // Generic handler for multi-select changes
  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOptions || []
    }));
  };

  // Generic handler for checkbox group changes
  const handleCheckboxGroupChange = (fieldName, value, checked) => {
    setFormData(prev => {
      let newValues = [...prev[fieldName]];
      
      if (value === 'Doesn\'t Matter') {
        newValues = checked ? ['Doesn\'t Matter'] : [];
      } else {
        if (checked) {
          newValues = newValues.filter(item => item !== 'Doesn\'t Matter');
          newValues.push(value);
        } else {
          newValues = newValues.filter(item => item !== value);
        }
        
        if (newValues.length === 0) {
          newValues = ['Doesn\'t Matter'];
        }
      }
      
      return { ...prev, [fieldName]: newValues };
    });
  };

  // Specific handlers
  const handleDietChange = (e) => {
    handleCheckboxGroupChange('advanceDiet', e.target.value, e.target.checked);
  };

  const handleProfileManagedByChange = (e) => {
    handleCheckboxGroupChange('advanceProfileManagedBy', e.target.value, e.target.checked);
  };

// const formatSearchData = (isAdvanced) => {
//   const prefix = isAdvanced ? 'advance' : '';
  
//   const getFieldValue = (field) => {
//     const fieldName = isAdvanced ? `advance${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
//     const value = formData[fieldName];
    
//     // Handle react-select objects
//     if (value && typeof value === 'object' && !Array.isArray(value)) {
//       return value.value || null;
//     }
    
//     return value;
//   };

//   const formatValue = (value, isArrayField = false) => {
//     if (value === 'Open for All' || value === null || value === undefined || value === '' || value === 'Doesn\'t Matter') {
//       return isArrayField ? [] : null;
//     }
    
//     if (Array.isArray(value)) {
//       return isArrayField ? value : value.length > 0 ? value[0] : null;
//     }
    
//     return isArrayField ? [value] : value;
//   };

//   const searchData = {
//     searchType: isAdvanced ? 'Advanced' : 'Basic',
//     looking_for: userInfo.looking_for === 'Bride' ? 'Groom' : 'Bride',
//     profileId: formatValue(getFieldValue('profileId')),
//     ageFrom: formatValue(getFieldValue('ageFrom')),
//     ageTo: formatValue(getFieldValue('ageTo')),
//     heightFrom: formatValue(getFieldValue('heightFrom')),
//     heightTo: formatValue(getFieldValue('heightTo')),
//     maritalStatus: formatValue(getFieldValue('maritalStatus')),
//     religion: formatValue(getFieldValue('religion')),
//     motherTongue: formatValue(getFieldValue('motherTongue'), true),
//     community: formatValue(getFieldValue('community'), true),
//     culture: formatValue(getFieldValue('community'), true), // Map community to culture
//     country: formatValue(getFieldValue('country')),
//     state: formatValue(getFieldValue('state')),
//     // Advanced-only fields
//     residencyStatus: isAdvanced ? formatValue(getFieldValue('residencyStatus')) : null,
//     countryGrew: isAdvanced ? formatValue(getFieldValue('countryGrew')) : null,
//     qualification: isAdvanced ? formatValue(getFieldValue('qualification')) : null,
//     educationArea: isAdvanced ? formatValue(getFieldValue('educationArea')) : null,
//     workingWith: isAdvanced ? formatValue(getFieldValue('workingWith')) : null,
//     professionArea: isAdvanced ? formatValue(getFieldValue('professionArea')) : null,
//     annualIncome: isAdvanced ? formatValue(getFieldValue('annualIncome')) : null,
//     diet: isAdvanced ? formatValue(getFieldValue('diet'), true) : [],
//     keywords: isAdvanced ? formatValue(getFieldValue('keywords')) : null,
//     page: 1,
//     limit: 20
//   };

//   // Remove null/empty values
//   Object.keys(searchData).forEach(key => {
//     if (searchData[key] === null || searchData[key] === undefined || 
//         (Array.isArray(searchData[key]) && searchData[key].length === 0)) {
//       delete searchData[key];
//     }
//   });

//   return searchData;
// };

  // Search profiles using Axios
  
  const formatSearchData = (isAdvanced) => {
    const prefix = isAdvanced ? 'advance' : '';
    
    const getFieldValue = (field) => {
      const fieldName = isAdvanced ? `advance${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
      const value = formData[fieldName];
      
      // Handle react-select objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value.value || null;
      }
      
      // Handle multi-select arrays
      if (Array.isArray(value)) {
        return value.map(item => {
          if (typeof item === 'object' && item.value) {
            return item.value;
          }
          return item;
        });
      }
      
      return value;
    };

    const formatValue = (value, isArrayField = false) => {
      if (value === 'Open for All' || value === null || value === undefined || value === '' || value === 'Doesn\'t Matter') {
        return isArrayField ? [] : null;
      }
      
      if (Array.isArray(value)) {
        return isArrayField ? value : value.length > 0 ? value[0] : null;
      }
      
      return isArrayField ? [value] : value;
    };

    const searchData = {
      searchType: isAdvanced ? 'Advanced' : 'Basic',
      looking_for: userInfo.looking_for === 'Bride' ? 'Groom' : 'Bride',
      profileId: formatValue(getFieldValue('profileId')),
      ageFrom: formatValue(getFieldValue('ageFrom')),
      ageTo: formatValue(getFieldValue('ageTo')),
      heightFrom: formatValue(getFieldValue('heightFrom')),
      heightTo: formatValue(getFieldValue('heightTo')),
      maritalStatus: formatValue(getFieldValue('maritalStatus')),
      religion: formatValue(getFieldValue('religion')),
      motherTongue: formatValue(getFieldValue('motherTongue')),
      community: formatValue(getFieldValue('community')),
      culture: formatValue(getFieldValue('community')),
      country: formatValue(getFieldValue('country')),
      state: formatValue(getFieldValue('state')),
      // Privacy and visibility settings
      visibleToAll: isAdvanced ? formData.advanceVisibleToAll : formData.visibleToAll,
      protectedPhoto: isAdvanced ? formData.advanceProtectedPhoto : formData.protectedPhoto,
      filterMeOut: isAdvanced ? formData.advanceFilterMeOut : formData.filterMeOut,
      iFilteredOut: isAdvanced ? formData.advanceIFilteredOut : formData.iFilteredOut,
      // Advanced-only fields
      residencyStatus: isAdvanced ? formatValue(getFieldValue('residencyStatus')) : null,
      countryGrew: isAdvanced ? formatValue(getFieldValue('countryGrew')) : null,
      qualification: isAdvanced ? formatValue(getFieldValue('qualification')) : null,
      educationArea: isAdvanced ? formatValue(getFieldValue('educationArea')) : null,
      workingWith: isAdvanced ? formatValue(getFieldValue('workingWith')) : null,
      professionArea: isAdvanced ? formatValue(getFieldValue('professionArea')) : null,
      annualIncome: isAdvanced ? formatValue(getFieldValue('annualIncome')) : null,
      diet: isAdvanced ? formatValue(getFieldValue('diet'), true) : [],
      keywords: isAdvanced ? formatValue(getFieldValue('keywords')) : null,
      chatAvailable: isAdvanced ? formData.advanceChatAvailable : null,
      profileManagedBy: isAdvanced ? formatValue(getFieldValue('profileManagedBy'), true) : [],
      page: 1,
      limit: 20
    };

    // Remove null/empty values but keep boolean values
    Object.keys(searchData).forEach(key => {
      if (searchData[key] === null || searchData[key] === undefined || 
          (Array.isArray(searchData[key]) && searchData[key].length === 0 && 
          !['diet', 'motherTongue', 'community', 'profileManagedBy'].includes(key))) {
        delete searchData[key];
      }
    });

    return searchData;
  };

  const searchProfiles = async (searchParams) => {
    try {
      console.log("searchParams", searchParams);
      const response = await axios.get(`${config.baseURL}/api/search/search-profiles`, {
        params: searchParams,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e, isAdvanced = false) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const searchData = formatSearchData(isAdvanced);
      console.log("Search Data from Search Form", searchData);
      const results = await searchProfiles(searchData);
      
      navigate('/search-results', {
        state: {
          searchData,
          initialResults: results.data
        }
      });
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset form - Fixed to properly reset all values
  const resetForm = (isAdvanced = false) => {
    if (isAdvanced) {
      setFormData(initialFormData);
    } else {
      setFormData(prev => ({
        ...initialFormData,
        // Keep advanced fields as they are for basic reset
        advanceProfileId: prev.advanceProfileId,
        advanceAgeFrom: prev.advanceAgeFrom,
        advanceAgeTo: prev.advanceAgeTo,
        advanceHeightFrom: prev.advanceHeightFrom,
        advanceHeightTo: prev.advanceHeightTo,
        advanceMaritalStatus: prev.advanceMaritalStatus,
        advanceReligion: prev.advanceReligion,
        advanceMotherTongue: prev.advanceMotherTongue,
        advanceCommunity: prev.advanceCommunity,
        advanceCountry: prev.advanceCountry,
        advanceState: prev.advanceState,
        advanceResidencyStatus: prev.advanceResidencyStatus,
        advanceCountryGrew: prev.advanceCountryGrew,
        advanceQualification: prev.advanceQualification,
        advanceEducationArea: prev.advanceEducationArea,
        advanceWorkingWith: prev.advanceWorkingWith,
        advanceProfessionArea: prev.advanceProfessionArea,
        advanceAnnualIncome: prev.advanceAnnualIncome,
        advanceDiet: prev.advanceDiet,
        advanceKeywords: prev.advanceKeywords,
        advanceChatAvailable: prev.advanceChatAvailable,
        advanceVisibleToAll: prev.advanceVisibleToAll,
        advanceProtectedPhoto: prev.advanceProtectedPhoto,
        advanceProfileManagedBy: prev.advanceProfileManagedBy,
        advanceFilterMeOut: prev.advanceFilterMeOut,
        advanceIFilteredOut: prev.advanceIFilteredOut
      }));
    }
  };

  const searchByProfileId = async (profileId, isAdvanced = false) => {
    try {
      const searchData = formatSearchData(isAdvanced);
      const response = await axios.get(`${config.baseURL}/api/search/search-by-profileId/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        navigate('/search-results', {
          state: {
            searchData,
            initialResults: [response.data.data]
          }
        });
      } else {
        toast.error(response.data.message || "Profile not found");
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  };

  return {
    formData,
    loading,
    searchResults,
    handleChange,
    handleSelectChange,
    handleMultiSelectChange,
    handleDietChange,
    handleProfileManagedByChange,
    handleSubmit,
    resetForm,
    searchByProfileId
  };
};

export default useSearchFormHandlers;