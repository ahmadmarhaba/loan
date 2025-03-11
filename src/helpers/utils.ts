export const validateUsername = (value: string) => {
  // Username must be between 3 and 20 characters long
  const regex = /^[a-zA-Z\s]{3,20}$/;
  return !regex.test(value);
};
