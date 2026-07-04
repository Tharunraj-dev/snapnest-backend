import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.signedCookies;
    
    if (!token) return res.status(401).json({ message: "No token provided" });
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;