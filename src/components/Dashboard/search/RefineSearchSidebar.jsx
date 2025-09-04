import React, { useState, useEffect } from 'react';
import { MARITAL_STATUS, RELIGIONS, CULTURES, LANGUAGES, DIET,COUNTRIES,PROFESSIONS,QUALIFICATIONS,OCCUPATIONS } from "../../../constants/formData";

const FilterSection = ({ title, type, options, value = [], onChange, showMore = false }) => {
  const [expanded, setExpanded] = useState(!showMore);
  const shouldShowMore = showMore && options.length > 5;
  const visibleOptions = expanded ? options : options.slice(0, 5);

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [value].filter(Boolean);

const handleChange = (optionValue) => {
    if (type === 'radio') {
    onChange(optionValue);
    } else {
    // For checkboxes
    const newValues = optionValue === 'Open for All' 
        ? ['Open for All']
        : safeValue.includes(optionValue)
        ? safeValue.filter(v => v !== optionValue && v !== 'Open for All')
        : [...safeValue.filter(v => v !== 'Open for All'), optionValue];
    
    onChange(newValues.length === 0 ? ['Open for All'] : newValues);
    }
};

  return (
    <div className="filter-section mb-3">
      <div className="filter-title d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold text-dark mb-0">{title}</h6>
      </div>
      
      <div className="filter-options">
        {visibleOptions.map((option, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type={type === 'radio' ? 'radio' : 'checkbox'}
              name={type === 'radio' ? title : `${title}-${option.value}`}
              id={`${title}-${option.value}`}
              checked={type === 'radio' 
                ? value === option.value 
                : safeValue.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
            <label className="form-check-label" htmlFor={`${title}-${option.value}`}>
              {option.label}
              {option.isNew && <span className="badge bg-primary ms-1">New</span>}
            </label>
          </div>
        ))}
        {shouldShowMore && (
          <button 
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <span className="text-primary">- Show Less</span>
            ) : (
              <span className="text-primary">+ Show More</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const MultiSelectFilter = ({ title, options, value = [], onChange, showMore = false }) => {
  const [expanded, setExpanded] = useState(!showMore);
  const shouldShowMore = showMore && options.length > 5;
  const visibleOptions = expanded ? options : options.slice(0, 5);

  const handleChange = (optionValue) => {
    const newValues = optionValue === 'Open for All' 
      ? ['Open for All']
      : value.includes(optionValue)
        ? value.filter(v => v !== optionValue && v !== 'Open for All')
        : [...value.filter(v => v !== 'Open for All'), optionValue];
    
    onChange(newValues.length === 0 ? ['Open for All'] : newValues);
  };

  return (
    <div className="filter-section mb-3">
      <div className="filter-title d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold text-dark mb-0">{title}</h6>
      </div>
      
      <div className="filter-options">
        {visibleOptions.map((option, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`${title}-${option.value}`}
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
            <label className="form-check-label" htmlFor={`${title}-${option.value}`}>
              {option.label}
              {option.isNew && <span className="badge bg-primary ms-1">New</span>}
            </label>
          </div>
        ))}
        {shouldShowMore && (
            <div className='d-flex justify-content-end'>
          <button 
            className="btn btn-link p-0 text-decoration-none small"
            onClick={() => setExpanded(!expanded)} 
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
            </div>
        )}
      </div>
    </div>
  );
};

const RefineSearchSidebar = ({ initialFilters = {}, onFilterChange, searchType }) => {
      const professionList = Object.values(PROFESSIONS).flat();
  const [filters, setFilters] = useState({
    ageFrom: '20',
    ageTo: '70',
    heightFrom: '5ft 0in',
    heightTo: '6ft 0in',
    maritalStatus: ['Open for All'],
    religion: ['Open for All'],
    motherTongue: ['Open for All'],
    community: ['Open for All'],
    verificationStatus: ['Open for All'],
    photoSettings: ['Open for All'],
    recentlyJoined: 'Open for All',
    diet: ['Open for All'],
    country: ['Open for All'],
    annualIncome: ['Open for All'],
    ...initialFilters
  });

  useEffect(() => {
    if (initialFilters) {
      const sanitizedFilters = Object.entries(initialFilters).reduce((acc, [key, val]) => {
        if (key === 'recentlyJoined') {
          acc[key] = val || 'Open for All';
        } else if (['ageFrom', 'ageTo', 'heightFrom', 'heightTo','looking_for','page','limit'].includes(key)) {
          acc[key] = val;
        } else {
          acc[key] = Array.isArray(val) ? val : [val].filter(Boolean);
        }
        return acc;
      }, {});
      
      setFilters(prev => ({
        ...prev,
        ...sanitizedFilters
      }));
    }
  }, [initialFilters]);

  const handleFilterChange = (filterKey, values) => {
    const newFilters = {
      ...filters,
      [filterKey]: values
    };
    console.log("New Filters",newFilters)
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

 const filterSections = [
    // Single select (radio) for recently joined
    { 
      filterKey: "recentlyJoined",
      title: "Recently Joined", 
      type: "radio",
      showMore: true,
      options: [
        { label: 'Open for All', value: 'Open for All' },
        { label: "Within a day", value: "1" },
        { label: "Within a week", value: "7" },
        { label: "Within a month", value: "30" }
      ]
    },
    // Multi-select checkboxes for all other filters
    { 
      filterKey: "maritalStatus",
      title: "Marital Status",
      showMore: true, 
      options: MARITAL_STATUS?.map(status => ({
        label: status.label,
        value: status.value
      }))
    },
    { 
      filterKey: "religion",
      title: "Religion", 
      showMore: true,
      options: RELIGIONS?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "motherTongue",
      title: "Language", 
      showMore: true,
      options: LANGUAGES?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "community",
      title: "Community", 
      showMore: true,
      options: CULTURES?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "diet",
      title: "Diet", 
      options: DIET?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "professionArea",
      title: "Profession",
      showMore: true, 
      options: professionList?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "country",
      title: "Country",
      showMore: true, 
      options: COUNTRIES?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "qualification",
      title: "Qualification",
      showMore: true, 
      options: QUALIFICATIONS?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    { 
      filterKey: "workingWith",
      title: "Working With",
      showMore: true, 
      options: OCCUPATIONS?.map(religion => ({
        label: religion.label,
        value: religion.value
      }))
    },
    // ... add other filter sections similarly
  ];

  const AgeRangeFilter = () => (
  <div className="filter-section mb-3">
    <div className="filter-title mb-2">
      <h6 className="fw-semibold text-dark mb-0">Age Range</h6>
    </div>
    <div className="d-flex align-items-center">
      <select 
        className="form-select form-select-sm me-2" 
        value={String(filters.ageFrom)}
        onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
      >
        {Array.from({length: 51}, (_, i) => 20 + i).map(age => (
          <option key={`from-${age}`} value={String(age)}>{age}</option>
        ))}
      </select>
      <span className="mx-1">to</span>
      <select 
        className="form-select form-select-sm ms-2" 
        value={String(filters.ageTo)}
        onChange={(e) => handleFilterChange('ageTo', e.target.value)}
      >
        {Array.from({length: 51}, (_, i) => 20 + i).map(age => (
          <option key={`to-${age}`} value={String(age)}>{age}</option>
        ))}
      </select>
    </div>
  </div>
);

const HeightRangeFilter = () => {
  // Generate height options
  const heightOptions = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      heightOptions.push(`${feet}ft ${inches}in`);
    }
  }

  return (
    <div className="filter-section mb-3">
      <div className="filter-title mb-2">
        <h6 className="fw-semibold text-dark mb-0">Height Range</h6>
      </div>
      <div className="d-flex align-items-center">
        <select 
          className="form-select form-select-sm me-2" 
          value={filters.heightFrom}
          onChange={(e) => handleFilterChange('heightFrom', e.target.value)}
        >
          {heightOptions.map((height, index) => (
            <option key={`from-${index}`} value={height}>{height}</option>
          ))}
        </select>
        <span className="mx-1">to</span>
        <select 
          className="form-select form-select-sm ms-2" 
          value={filters.heightTo}
          onChange={(e) => handleFilterChange('heightTo', e.target.value)}
        >
          {heightOptions.map((height, index) => (
            <option key={`to-${index}`} value={height}>{height}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const IncomeRangeFilter = () => {
  const incomeOptions = [
   { label: "All", value: "all" },
  { label: "Upto $25,000", value: "0-25000" },
  { label: "$25,000-$50,000", value: "25000-50000" },
  { label: "$50,000-$100,000", value: "50000-100000" },
  { label: "$100,000-$200,000", value: "100000-200000" },
  { label: "Above $200,000", value: "200000" },
  ];

  return (
    <FilterSection
      title="Annual Income"
      filterKey="annualIncome"
      type="checkbox"
      options={incomeOptions}
      value={filters.annualIncome}
      onChange={(values) => handleFilterChange('annualIncome', values)}
    />
  );
};

  return (
    <div className="left-sidebar">
      <div className="bg-light border rounded p-2">
        <div className="side-heading mb-2">
          <h6 className="fw-semibold text-dark mb-0">Refine Search</h6>
        </div>
        
        <AgeRangeFilter />
        <HeightRangeFilter />
        
        {/* Recently Joined (single select) */}
        <FilterSection
          filterKey="recentlyJoined"
          title="Recently Joined"
          type="radio"
          options={filterSections.find(f => f.filterKey === 'recentlyJoined').options}
          value={filters.recentlyJoined}
          onChange={(value) => handleFilterChange('recentlyJoined', value)}
        />
        
        {/* Multi-select filters */}
        {filterSections
          .filter(f => f.filterKey !== 'recentlyJoined')
          .map((section, index) => (
            <MultiSelectFilter
              key={index}
              filterKey={section.filterKey}
              title={section.title}
              options={[{ label: 'Open for All', value: 'Open for All' }, ...section.options]}
              value={filters[section.filterKey]}
              showMore={section.showMore}
              onChange={(values) => handleFilterChange(section.filterKey, values)}
            />
          ))}

          <IncomeRangeFilter/>
      </div>
    </div>
  );
};

export default RefineSearchSidebar;