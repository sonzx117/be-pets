var Product = require("../models").Product;
var Tag = require("../models").Tag;
var Category = require("../models").Category;
var ImageProduct = require("../models").ImageProduct;
const { Op } = require("sequelize");
require("dotenv").config();
let PAGE_SIZE = parseInt(process.env.PAGE_SIZE);
exports.create = (req, res) => {
  Product.create(req.body, { include: ["imgproduct", "tagproduct"] })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((er) => {
      throw er;
    });
};
exports.findall = (req, res) => {
  var page = req.query.page;
  var status = req.query.status;
  page = parseInt(page);
  let soLuongBoQua = (page - 1) * PAGE_SIZE;
  if (page || status) {
    if (page && !status) {
      Product.findAndCountAll({
        order: [["id", "DESC"]],
        offset: soLuongBoQua,
        where: { quantity: { [Op.ne]: 0 } },
        limit: PAGE_SIZE,
      })
        .then((data) => {
          res.json({ data: data });
        })
        .catch((er) => {
          throw er;
        });
    } else if (status && !page) {
      Product.findAndCountAll({
        where: { status: status, quantity: { [Op.ne]: 0 } },
        order: [["id", "DESC"]],
      })
        .then((data) => {
          res.json({ data: data });
        })
        .catch((er) => {
          throw er;
        });
    } else {
      Product.findAndCountAll({
        where: { status: status, quantity: { [Op.ne]: 0 } },
        order: [["id", "DESC"]],
        offset: soLuongBoQua,
        limit: PAGE_SIZE,
      })
        .then((data) => {
          res.json({ data: data });
        })
        .catch((er) => {
          throw er;
        });
    }
  } else {
    Product.findAndCountAll({
      order: [["id", "DESC"]],
      where: { quantity: { [Op.ne]: 0 } },
    })
      .then((data) => {
        res.json({ data: data });
      })
      .catch((er) => {
        throw er;
      });
  }
};
exports.findone = (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [
      { model: Tag, where: { status: 1 } },
      { model: ImageProduct, as: "imgproduct", attributes: ["link"] },
      { model: Category, attributes: ["id", "name"], where: { status: 1 } },
    ],
  })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((er) => {
      throw er;
    });
};
exports.delete = (req, res) => {
  Product.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((er) => {
      throw er;
    });
};
exports.update = (req, res) => {
  Product.update(req.body, { where: { id: req.params.id } })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((er) => {
      throw er;
    });
};

exports.updateQuantity = (req, res) => {
  console.log(req.body);
  Product.bulkCreate(req.body, {
    updateOnDuplicate: ["quantity"],
  })
    .then((data) => {
      res.json({ data: data });
    })
    .catch((er) => {
      throw er;
    });
};
