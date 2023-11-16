var User = require("../models").User;
var Role = require("../models").Role;
const bcryptjs = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const avatarLogin =
  "https://cdn.pixabay.com/photo/2016/11/22/23/18/kingfisher-1851127_960_720.jpg";
exports.login = async (req, res) => {
  // User.findOne({
  //   where: { email: req.body.email, password: req.body.password },
  //   attributes: [
  //     "avatar",
  //     "firstName",
  //     "lastName",
  //     "id",
  //     "phone",
  //     "male",
  //     "address",
  //     "email",
  //   ],
  //   include: [Role],
  // }).then((data) => {
  //   if (data !== null) {
  //     var user = {
  //       id: data.id,
  //       avatar: data.avatar,
  //       role: data.Roles.length > 0 ? data.Roles[0].name : "user",
  //     };
  //     var token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
  //       algorithm: "HS256",
  //       expiresIn: "3h",
  //     });
  //     res.json(token);
  //   } else {
  //     res.status(400).json({ message: "Something went wrong!" });
  //   }
  // });

  User.findOne({
    where: { email: req.body.email },
    attributes: [
      "avatar",
      "firstName",
      "lastName",
      "id",
      "phone",
      "male",
      "address",
      "email",
      "password",
    ],
    include: [Role],
  }).then((data) => {
    console.log(data);
    if (data !== null) {
      bcryptjs.compare(
        req.body.password,
        data.password,
        function (err, result) {
          if (result) {
            var user = {
              id: data.id,
              avatar: data.avatar === null ? avatarLogin : data.avatar,
              role: data.Roles.length > 0 ? data.Roles[0].name : "user",
            };
            console.log(user);
            const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
              algorithm: "HS256",
              expiresIn: "3h",
            });
            res.json(token);
          } else {
            res.status(400).json({ message: "Something went wrong!" });
          }
        }
      );
    }
  });
};
