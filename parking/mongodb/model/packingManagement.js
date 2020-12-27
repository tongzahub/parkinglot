const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let packingmanagementSchema = new Schema(
  {
    slotIndex: {
      type: String,
      unique: true,
      required: true,
    },
    indexForSorting :{
      type: Number,
    },
    packingProfileId:{
      type: String,
    },
    numberPlate: {
      type: String,
    },
    ticketId: {
      type: String,
    },
    slotType: {
      type: String, 
    },
    slotStatus: {
      type: String 
    },
  },
  { collection: "PackingManagement" }
);

module.exports = mongoose.model("packingmanagement", packingmanagementSchema);
