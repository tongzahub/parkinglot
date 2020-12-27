const mongoose = require("mongoose");
const { async } = require("validate.js");
const packingmanagement = require("../model/packingManagement");
const packingprofile = require("../model/packingProfile");
require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

async function updatePackingProfile(currentPackingStatus, slotType) {
    return new Promise((resolve, reject) => {
      var update = "";
      if (slotType == "S") {
        if(currentPackingStatus.currentVehicleInSlotS > 1) {
        update = {
          $set: {
            currentVehicleInSlotS: currentPackingStatus.currentVehicleInSlotS -1,
          },
        }
        }else{
            update = {
                $set: {
                  currentVehicleInSlotS: 0,
                },
              }
        }
      } else if (slotType == "M") {
        if(currentPackingStatus.currentVehicleInSlotM > 1) {
        update = {
          $set: {
            currentVehicleInSlotM: currentPackingStatus.currentVehicleInSlotM -1,
          },
        } }else{
            update = {
                $set: {
                    currentVehicleInSlotM: 0,
                },
              }
        }
      } else if (slotType == "L") {
        if(currentPackingStatus.currentVehicleInSlotL > 1) {
        update = {
          $set: {
            currentVehicleInSlotL: currentPackingStatus.currentVehicleInSlotL -1,
          },
        }}else{
            update = {
                $set: {
                    currentVehicleInSlotL: 0,
                },
              }
        }
      }
  
      console.log("_id", currentPackingStatus._id);
      console.log("update", update);
      packingprofile.where("_id", currentPackingStatus._id).update(
       update,
        function (err, result) {
          if (err) {
            // console.log(err);
            reject(err);
          } else {
            // console.log("result", result);
            resolve(result);
          }
        }
      );
    });
  }


  async function getPackingProfileStatus({ packingId }) {
    return new Promise((resolve, reject) => {
      packingprofile.findById({ _id: packingId }, function (err, result) {
        if (err) {
        //   console.log(err);
          reject(err);
        } else {
        //   console.log("result", result);
          resolve(result);
        }
      });
    });
  }
module.exports.leavePackingSlot = async ({ slotId,packingId,slotType }) => {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    connection.once("open", async function () {

       
      let currentPackingStatus = await getPackingProfileStatus({ packingId });
      await updatePackingProfile(currentPackingStatus, slotType)


      packingmanagement.where("_id", slotId).update(
        {
          $set: {
            slotStatus: "available",
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
            mongoose.connection.close();
            reject(err);
          } else {
            console.log("result", result);
            mongoose.connection.close();
            resolve(result);
          }
        }
      );


    });
  });
};
