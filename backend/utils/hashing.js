const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // You can adjust the salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (enteredPassword, storedHashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    return isMatch;
  };

module.exports = { hashPassword , verifyPassword };
