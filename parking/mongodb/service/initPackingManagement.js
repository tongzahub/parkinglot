const mongoose = require("mongoose");
const packingmanagement = require("../model/packingManagement");

require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

module.exports.initPackingMamagement = async (req) => {
    console.log("initPackingMamagement",req);
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once("open", function () {
      const { S, M, L ,_id } = req;
      var params = [];

     for (let index = 0; index < S; index++) {
        params.push({
          slotIndex: "S" + (index + 1),
          slotType: "S",
          slotStatus: "available",
          indexForSorting: index + 1,
          packingProfileId:_id
        });
      }

      for (let index = 0; index < M; index++) {
        params.push({
          slotIndex: "M" + (index + 1),
          slotType: "M",
          slotStatus: "available",
          indexForSorting: index + 1,
          packingProfileId:_id
        });
      }

      for (let index = 0; index < L; index++) {
        params.push({
          slotIndex: "L" + (index + 1),
          slotType: "L",
          slotStatus: "available",
          indexForSorting: index + 1,
          packingProfileId:_id
        });
      }

      console.log("params",params);
      packingmanagement.insertMany(params, function (err, result) {
        if (err) {
        //   console.log(err);
          mongoose.connection.close();
          reject(err);
        } else {
        //   console.log(result);
          mongoose.connection.close();
          resolve(result);
        }
      });
    });
  });
};
