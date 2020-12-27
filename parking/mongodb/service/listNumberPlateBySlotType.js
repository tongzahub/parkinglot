const mongoose = require("mongoose");
const packingmanagement = require("../model/packingManagement");

require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

module.exports.listNumberPlateBySlotType = async ({slotType,packingId}) => {
  console.log("listNumberPlateBySlotType", slotType,packingId);

  return new Promise((resolve, reject) => {

    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    packingmanagement.find({ slotType: slotType, packingProfileId: packingId ,  $or: [ {slotStatus:{$eq:"unavailable"}},{slotStatus:{$eq:"reserve"}}]}, function (err, result) {
        if (err) {
            // console.log(err);
            mongoose.connection.close()
            reject(err)
          } else {
            // console.log(result);
            mongoose.connection.close()
            resolve(result)
          }
    });

  });
};
