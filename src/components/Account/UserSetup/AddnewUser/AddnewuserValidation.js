const AddnewuserValidation = (values, roles) => {
  let errors = {};
  if (!values.supervisorname) {
    errors.supervisorname = "supervisorname is required.";
  }
  if (!values.phone) {
    errors.phone = "Phone number required";
  } else if (values.phone.length !== 10) {
    errors.phone = "Phone number must be in 10 digits ";
  }
  // if (!values.email) {
  //   errors.email = "Email is required";
  // } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(values.email)) {
  //   errors.email = "Email is Invalid";
  // }
  if (!values.username) {
    errors.username = "username is required.";
  }
  if (!values.password) {
    errors.password = "password is required.";
  }
  if (roles === "Select_role_for_staff") {
    errors.roles = "role is required.";
  }
  return errors;
};

export default AddnewuserValidation;
