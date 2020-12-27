const mongoose = require("mongoose");
const packingprofile = require("../model/packingProfile");

require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

module.exports.getPackingStatus = async (req) => {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    const {packingId} = req
    console.log('getPackingStatus : ',packingId);
    connection.once("open", function () {

      packingprofile.findById(packingId, function (err, result) {
        if (err) {
          console.log(err);
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
