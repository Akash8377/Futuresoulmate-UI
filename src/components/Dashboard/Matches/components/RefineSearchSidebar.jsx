import React from "react";
import FilterSection from "./FilterSection";
import {
  MARITAL_STATUS,
  RELIGIONS,
  DIET,
  COUNTRIES,
} from "../../../../constants/formData";

const RefineSearchSidebar = ({ setFilters }) => {
  const filterSections = [
    // {
    //   filterKey: "verificationStatus",
    //   title: "Verification Status",
    //   type: "checkbox",
    //   options: [
    //     { label: "All", value: "all" },
    //     { label: "Blue Tick Profiles", value: "verified", isNew: true }
    //   ]
    // },
    // {
    //   filterKey: "photoSettings",
    //   title: "Photo Settings",
    //   type: "checkbox",
    //   options: [
    //     { label: "All", value: "all" },
    //     { label: "Visible to all", value: "public" },
    //     { label: "Protected Photos", value: "protected" }
    //   ]
    // },
    {
      filterKey: "recentlyJoined",
      title: "Recently Joined",
      type: "radio",
      options: [
        { label: "All", value: "all" },
        { label: "Within a day", value: "1" },
        { label: "Within a week", value: "7" },
        { label: "Within a month", value: "30" },
      ],
    },
    {
      filterKey: "maritalStatus",
      title: "Marital Status",
      type: "checkbox",
      showMore: true,
      options: [{ label: "All", value: "all" },...MARITAL_STATUS],
    },
    {
      filterKey: "religion",
      title: "Religion",
      type: "checkbox",
      showMore: true,
      options: [{ label: "All", value: "all" },...RELIGIONS],
    },
    {
      filterKey: "diet",
      title: "Diet",
      type: "checkbox",
      showMore: true,
      options: [{ label: "All", value: "all" },...DIET],
    },
    {
      filterKey: "country",
      title: "Country Live In",
      type: "checkbox",
      showMore: true,
      options: [{ label: "All", value: "all" },...COUNTRIES],
    },
    {
      filterKey: "income",
      title: "Annual Income",
      type: "checkbox",
      showMore: true,
      options: [
        { label: "All", value: "all" },
        { label: "Upto INR 1 Lakh", value: "0-1" },
        { label: "INR 1-5 Lakh", value: "1-5" },
        { label: "INR 5-10 Lakh", value: "5-10" },
        { label: "INR 10-20 Lakh", value: "10-20" },
        { label: "Above 20 Lakh", value: "20+" },
      ],
    },
  ];

  const handleFilterChange = (filterKey, values) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: values,
    }));
  };

  return (
    <div className="left-sidebar">
      <div className="bg-light border rounded p-2">
        <div className="side-heading mb-2">
          <h6 className="fw-semibold text-dark mb-0">Refine Search</h6>
        </div>

        {filterSections.map((section, index) => (
          <FilterSection
            key={index}
            filterKey={section.filterKey}
            title={section.title}
            type={section.type}
            options={section.options}
            showMore={section.showMore || false}
            onChange={handleFilterChange}
          />
        ))}
      </div>
    </div>
  );
};

export default RefineSearchSidebar;
