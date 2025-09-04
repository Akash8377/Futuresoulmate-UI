export function camelCaseToNormalText(camelCaseStr) {
  // Handle empty or non-string input
  if (typeof camelCaseStr !== "string" || camelCaseStr.length === 0) {
    return camelCaseStr;
  }

  // Add space before capital letters and trim
  const withSpaces = camelCaseStr.replace(/([A-Z])/g, " $1").trim();

  // Capitalize the first letter of each word
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function calculateAge(birthYear, birthMonth, birthDay) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns 0-11
  const currentDay = today.getDate();

  let age = currentYear - birthYear;

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scrolling animation
  });
}

export function scrollToBottom() {
  // Scroll to the very bottom of the page
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth", // Optional: adds smooth scrolling animation
  });
}

/**
 * Scrolls the page to a specific percentage of its height
 * @param {number} percent - The percentage to scroll to (0-100)
 * @param {Object} [options] - Optional scroll behavior settings
 * @param {string} [options.behavior='smooth'] - Scroll behavior ('auto' or 'smooth')
 * @param {HTMLElement} [options.element] - Specific element to scroll (defaults to window)
 */
export function scrollToPercent(percent, options = {}) {
  // Validate percentage
  percent = Math.max(0, Math.min(100, percent));

  // Get the scrollable element (default to window)
  const element = options.element || document.documentElement;
  const isWindow = !options.element;

  // Calculate scroll position
  const scrollHeight = isWindow
    ? document.body.scrollHeight
    : element.scrollHeight;
  const clientHeight = isWindow ? window.innerHeight : element.clientHeight;
  const maxScroll = scrollHeight - clientHeight;
  const targetPosition = (maxScroll * percent) / 100;

  // Scroll to position
  if (isWindow) {
    window.scrollTo({
      top: targetPosition,
      behavior: options.behavior || "smooth",
    });
  } else {
    element.scrollTo({
      top: targetPosition,
      behavior: options.behavior || "smooth",
    });
  }
}

export const parseAgeRange = (range) =>
  range ? range.split(" – ").map(Number) : [18, 60];

export const parseHeight = (heightStr) => {
  if (!heightStr) return [140, 200];
  return heightStr
    .split(" – ")
    .map((h) => {
      const [feet, inches] = h
        .split("′ ")
        .map((part) => parseInt(part.replace("″", "")));
      return feet * 30.48 + inches * 2.54;
    })
    .slice(0, 2);
};

export const formatHeight = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}′ ${inches}″`;
};


export const convertAgeRange = (ageStr) => {
  if (!ageStr) return [20, 30]; // Default fallback
  return ageStr.split(/\s*–\s*/).map(Number).filter(n => !isNaN(n));
};
export const convertHeightRange = (heightStr) => {
  if (!heightStr) return [59, 67]; // Default fallback
  
  const feetInchesToInches = (str) => {
    const [feet, inches] = str.match(/\d+/g) || [0, 0];
    return parseInt(feet) * 12 + parseInt(inches);
  };

  const heights = heightStr.split(/\s*–\s*/).map(feetInchesToInches);
  return heights.length === 2 ? heights : [59, 67];
};

export const convertIncomeRange = (incomeStr) => {
  if (!incomeStr) return [50000, 100000]; // Default fallback ($50K–$100K)

  // Remove $ and commas
  const cleaned = incomeStr.replace(/[$,]/g, "");

  // Match full numbers (e.g., 55510, 171245)
  const numbers = cleaned.match(/\d+/g);

  if (!numbers || numbers.length === 0) return [50000, 100000];

  return [parseInt(numbers[0]), parseInt(numbers[1] || numbers[0])];
};



// Scroll to any component with any offset (adjust as needed)
export const scrollToComponent = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};