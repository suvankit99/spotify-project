// tokenUtils.js
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv') ;
dotenv.config() ; 

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    username: user.username,
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
};

const verifyToken = (token) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return {
      valid: true,
      decoded,
    };
    console.log("decoded :", decoded);
  } catch (error) {
    // If token is invalid or expired
    return {
      valid: false,
      error: error.message,
    };
  }
};

const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { error: "No token provided" };
    return;
  }
  const token = authHeader.replace("Bearer ", "");
  const result = verifyToken(token);
  if (!result.valid) {
    ctx.status = 401;
    ctx.body = { error: result.error };
    return;
  }
  await next();
};

module.exports = { generateToken , verifyToken , authMiddleware};
