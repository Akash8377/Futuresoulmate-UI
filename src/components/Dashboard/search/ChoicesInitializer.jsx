import { useEffect } from 'react';
import Choices from 'choices.js';

const useChoicesInitializer = (isAdvanced = false) => {
  useEffect(() => {
    // Initialize all Choices.js select elements after a small delay
    // to ensure they're in the DOM
    const initChoices = () => {
      const selectIds = [
        'motherTongue',
        'maritalStatus',
        'religion',
        'community',
        'country',
        'state'
      ];

      if (isAdvanced) {
        selectIds.push(
          'advanceMotherTongue',
          'advanceMaritalStatus',
          'advanceReligion',
          'advanceCommunity',
          'advanceCountry',
          'advanceState',
          'advanceResidencyStatus',
          'advanceCountryGrew',
          'advanceQualification',
          'advanceEducationArea',
          'advanceWorkingWith',
          'advanceProfessionArea'
        );
      }

      selectIds.forEach(id => {
        const element = document.getElementById(id);
        if (element && !element.classList.contains('choices__input')) {
          new Choices(`#${id}`, {
            removeItemButton: true,
            searchEnabled: true,  // Changed from false to true
            searchPlaceholderValue: 'Search...', // Optional: Add search placeholder
            shouldSort: false // Optional: Keep original order of options
          });
        }
      });
    };

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(initChoices, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup Choices instances if needed
      const selects = document.querySelectorAll('.choices__input');
      selects.forEach(select => {
        const choicesInstance = select.closest('.choices')._choices;
        if (choicesInstance) {
          choicesInstance.destroy();
        }
      });
    };
  }, [isAdvanced]);
};

export default useChoicesInitializer;



// import { useEffect } from 'react';
// import Choices from 'choices.js';

// const useChoicesInitializer = (isAdvanced = false) => {
//   useEffect(() => {
//     // Initialize all Choices.js select elements after a small delay
//     // to ensure they're in the DOM
//     const initChoices = () => {
//       const selectIds = [
//         'motherTongue',
//         'maritalStatus',
//         'religion',
//         'community',
//         'country',
//         'state'
//       ];

//       if (isAdvanced) {
//         selectIds.push(
//           'advanceMotherTongue',
//           'advanceMaritalStatus',
//           'advanceReligion',
//           'advanceCommunity',
//           'advanceCountry',
//           'advanceState',
//           'advanceResidencyStatus',
//           'advanceCountryGrew',
//           'advanceQualification',
//           'advanceEducationArea',
//           'advanceWorkingWith',
//           'advanceProfessionArea'
//         );
//       }

//       selectIds.forEach(id => {
//         const element = document.getElementById(id);
//         if (element && !element.classList.contains('choices__input')) {
//           new Choices(`#${id}`, {
//             removeItemButton: true,
//             placeholder: true,
//             placeholderValue: id.includes('motherTongue') ? '' : 
//               `Select ${id.replace('advance', '').replace(/([A-Z])/g, ' $1').trim()}`,
//             searchEnabled: false,
//           });
//         }
//       });
//     };

//     // Small timeout to ensure DOM is ready
//     const timer = setTimeout(initChoices, 100);

//     return () => {
//       clearTimeout(timer);
//       // Cleanup Choices instances if needed
//     };
//   }, [isAdvanced]);
// };

// export default useChoicesInitializer;