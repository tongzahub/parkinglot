const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let packingProfileSchema = new Schema(
  {
    currentVehicleInSlotS:{
      type: Number,
    },
    currentVehicleInSlotM :{
      type: Number,
    },
    currentVehicleInSlotL:{
      type: Number,
    },
    statusByslotTypeS: {
      type: Boolean, 
    },
    statusByslotTypeM: {
      type: Boolean, 
    },
    statusByslotTypeL: {
        type: Boolean, 
    },
    initSlotTypeS: {
        type: Number, 
    },
    initSlotTypeM: {
        type: Number, 
    },
    initSlotTypeL: {
        type: Number, 
    },
  },
  { collection: "PackingProfile" }
);

module.exports = mongoose.model("packingprofile", packingProfileSchema);
