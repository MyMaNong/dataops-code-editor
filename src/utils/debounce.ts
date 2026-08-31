/**
- 防抖
- @param func
- @param wait
- @returns
*/
export const debounce = (func, wait) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};