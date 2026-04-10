const validator = require("validator");

module.exports.validateEventForm = (req, res, next) => {
  const { fullName, mobileNumber, productType, email } = req.body;

  if (!fullName || !mobileNumber || !productType) {
    return res.status(400).json({ message: "Name, mobile number and product enquiry are required." });
  }

  if (!validator.isLength(fullName.trim(), { min: 2, max: 100 })) {
    return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
  }

  if (!validator.isMobilePhone(mobileNumber.toString(), "en-IN")) {
    return res.status(400).json({ message: "Please enter a valid Indian mobile number." });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  next();
};

module.exports.validateShowroomForm = (req, res, next) => {
  const { fullName, mobileNumber, userType, productType, companyName, city, state, representative, email } = req.body;

  const required = { fullName, mobileNumber, userType, productType, companyName, city, state, representative };
  for (const [field, value] of Object.entries(required)) {
    if (!value || !value.toString().trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }
  }

  if (!validator.isLength(fullName.trim(), { min: 2, max: 100 })) {
    return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
  }

  if (!validator.isMobilePhone(mobileNumber.toString(), "en-IN")) {
    return res.status(400).json({ message: "Please enter a valid Indian mobile number." });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  next();
};
