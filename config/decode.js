import jwt from "jsonwebtoken";

export const decode = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(400)
      .json({ success: false, msg: "No access token provided!" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    (req.userId = decoded.userId), (req.user = decoded.user);
    return next();
  } catch (err) {
    return res
      .status(402)
      .json({ success: false, msg: "Unauthorized!!" + err.message });
  }
};
