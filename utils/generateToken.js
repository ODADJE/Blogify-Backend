const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  //cerate payload for the user
  const payload = {
    user: {
      id: user._id,
    },
  };

  //sign the token with a secret key
  return (token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: 36000, // Expires 1hr
  }));
};

module.exports = generateToken;
