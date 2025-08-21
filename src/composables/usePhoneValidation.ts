export function usePhoneValidation() {
  const validatePhone = (phone: number) => {
    // Basic pattern: only digits, optional "+" at start, 7–15 digits total
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!phone) {
      return false;
    }

    if (!phoneRegex.test(phone)) {
      return false;
    }
    return true;
  };

  return {
    validatePhone,
  };
}
