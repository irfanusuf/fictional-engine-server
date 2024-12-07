const jwt = require("jsonwebtoken");

const verfiyToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401);
    }

    const secretkey = "randomstringkuchbhuikjhfnsuyhfsjuhsdjhgbsdsdfhgbfu";
    jwt.verify(token, secretkey, (error, resolve) => {
      if (error) {
        return res.status(403);
      }

      if (resolve) return res.status(200).json({ userId: resolve.userId });
    });
  } catch (error) {
    console.error(error);
  }
};



module.exports ={verfiyToken}