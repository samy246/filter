const MyProfileValidation = (values) => {
  let errors = {};

  if (!values.username) {
    errors.username = "userName is required.";
  }
  if (!values.phone) {
    errors.phone = "Phone number required";
  } else if (values.phone.length !== 10) {
    errors.phone = "Phone number must be in 10 digits ";
  }
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(values.email)) {
    errors.email = "Email is Invalid";
  }
  return errors;
};

export default MyProfileValidation;
