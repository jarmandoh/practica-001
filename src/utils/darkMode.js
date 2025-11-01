// Utility to get dark mode state from DOM
export const checkDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};
