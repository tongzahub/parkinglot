const mongoose = require("mongoose");
const packingprofile = require("../model/packingProfile");
const packingmanagement = require("../model/packingManagement");
const axios = require("axios");
const { async } = require("validate.js");
require("dotenv").config();

var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;

async function fingSlotByCarSize({ packingId, slotType }) {
  return new Promise((resolve, reject) => {
    let params = {
      slotType: slotType,
      packingProfileId: packingId,
      slotStatus: "available",
    };
    packingmanagement
      .findOne(params)
      .sort("indexForSorting")
      .exec(function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
  });
}

async function updateReserveSlot({ slotId, ticketId, numberPlate }) {
  return new Promise((resolve, reject) => {
    packingmanagement.where("_id", slotId).update(
      {
        $set: {
          ticketId: ticketId,
          numberPlate: numberPlate,
          slotStatus: "reserve",
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
}

async function updatePackingProfile(currentPackingStatus, slotType) {
  return new Promise((resolve, reject) => {
    var update = "";
    if (slotType == "S") {
      update = {
        $set: {
          currentVehicleInSlotS: currentPackingStatus.currentVehicleInSlotS + 1,
        },
      };
    } else if (slotType == "M") {
      update = {
        $set: {
          currentVehicleInSlotM: currentPackingStatus.currentVehicleInSlotM + 1,
        },
      };
    } else if (slotType == "L") {
      update = {
        $set: {
          currentVehicleInSlotL: currentPackingStatus.currentVehicleInSlotL + 1,
        },
      };
    }

    console.log("_id", currentPackingStatus._id);
    console.log("update", update);
    packingprofile.where("_id", currentPackingStatus._id).update(
     update,
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
}

async function getPackingProfileStatus({ packingId }) {
  return new Promise((resolve, reject) => {
    packingprofile.findById({ _id: packingId }, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("result", result);
        resolve(result);
      }
    });
  });
}

module.exports.allocatedByCarSize = async (req) => {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    const { packingId, slotType, numberPlate, carSize } = req;
    // "numberPlate":"ABC" ,
    // "carSize":"S"

    connection.once("open", async function () {
      //   try {
      let findSlot = await fingSlotByCarSize({ packingId, slotType });
      console.log("findSlot",findSlot);
      let slotIndex = findSlot.slotIndex
      if (findSlot) {
        /** crate Ticket */
        const TICKETHOSR =  process.env.TICKETHOSR
        let ticket = await axios.post(`http://${TICKETHOSR}:4001/ticket`, {
          type: "allocatedByCarSize",
          data: {
            numberPlate,
            carSize,
            packingId,
            slotIndex
          },
        });

        console.log("findSlot", findSlot);
        let slotId = findSlot._id;
        let ticketId = ticket.data._id;
        await updateReserveSlot({
          slotId,
          ticketId,
          numberPlate,
        });

        /** update  packingProfile*/
        let packingProfileSatus = await getPackingProfileStatus({ packingId });
         await updatePackingProfile(
          packingProfileSatus,
          slotType
        );

        mongoose.connection.close();

        findSlot["ticketId"] = ticketId;
        findSlot["numberPlate"] = numberPlate;
        findSlot["carSize"] = carSize;
        resolve(findSlot);
      } else {
        mongoose.connection.close();
        reject({ meassage: "Slot Type : " + slotType + " is not Avalible" });
      }
    });
  });
};
