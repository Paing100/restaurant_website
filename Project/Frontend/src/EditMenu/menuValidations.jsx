export const validateName = (name) => {
    // Name should be 3-50 characters, only letters, spaces, and hyphens
    return /^[A-Za-z\s-]{3,50}$/.test(name);
  };

export const validateDescription = (description) => {
    // Description should be 10-250 characters
    return description.length >= 10 && description.length <= 250;
  };

export const validatePrice = (price) => {
    // Price should be a positive number between 0 and 21
    return price > 0 && price < 21;
  };

export const validateCalories = (calories) => {
    // Calories should be between 0 and 2000
    return calories >= 0 && calories <= 2000;
  };

export const validateCategory = (category) => {
    // Category should be between 0 and 3
    return category >= 0 && category <= 3;
  };