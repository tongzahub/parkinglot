const mongoose = require("mongoose");
const packingmanagement = require("../model/packingManagement");

require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

module.exports.checkinPackingSlot = async ({ slotId }) => {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once("open", function () {
      packingmanagement.where("_id", slotId).update(
        {
          $set: {
            slotStatus: "unavailable",
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("result", result);
            resolve(result);
          }
        }
      );
    });
  });
};
