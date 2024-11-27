const jwt = require("jsonwebtoken");

const isAuthorised = async (req, res, next) => {
  try {
    const {token} = req.query;

    if (!token) {
      return res.status(403).json({ message: "unaAuthorised" });
    }
    const secretkey = "randomstringkuchbhuikjhfnsuyhfsjuh";

    const verifyToken = jwt.verify(token, secretkey, (reject, resolve) => {
      if (reject) {
        return res.status(401).json({ message: "Forbidden" });
      }

      req.userId = resolve.userId;

      next();
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { isAuthorised };
