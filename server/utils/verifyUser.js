import jwt from "jsonwebtoken";
import { errorHandle } from "../utils/Error.js";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log(req.cookies)
  if (!token) return next(errorHandle(401, "unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandle(403, "Forbidden"));

    req.user = user;
    next();
  });
};

// import jwt from "jsonwebtoken";
// import { errorHandle } from "../utils/Error.js";
// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.splt(" ")[0];

//   console.log("Token:", token);
  
//   if (!token) return next(errorHandle(401, "unauthorized"));
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandle(403, "Forbidden"));

//     req.user = user;
//     next();
//   });
// };
