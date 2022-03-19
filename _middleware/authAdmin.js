const _ = require("lodash");
const { admin } = require("../models");

const {
  notifyUser,
  errorHandler,
  sendData,
  recordExists,
} = require("../_helper");
const {user } = require("../models")

exports.checkRecord = async (req, res, next) => {
  try {
    let { phoneNumber } = req.body;
    let u = user
      .findOne({
        phoneNumber,
      })
      .then((user) => {
        if (!user) {
          next();
        } else {
          recordExists("admin already exists!", res);
        }
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

exports.authMiddleware = (req, res, next) => {
  try {
    let authUserId = req.user.id;
    return db.admin
      .findOne({ where: { id: authUserId } })
      .then((user) => {
        if (!(user === null)) {
          req.profile = user;
          next();
        } else {
          notifyUser("user does not exist! please signUp first", res);
        }
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
exports.checkAdmin = (req, res, next) => {
  if (req.profile.role === "admin") {
    next();
  } else {
    notifyUser("admin with this email/username not found!");
  }
};