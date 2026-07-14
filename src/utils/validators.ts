export const validators = {
  isValidEmail: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  isValidPhone: (phone: string): boolean => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  },
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  }
};
