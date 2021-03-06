const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let tickerSchema = new Schema(
  {
    numberPlate: {
      type: String
    },
    carSize: {
      type: String
    },
    timeStampIn: {
      type: String
    },ticketDate :{
      type: String
    },
    packingId :{
      type: String
    },
    slotIndex:{
      type:String
    }
  },
  { collection: "Ticket" }
);

module.exports = mongoose.model("ticket", tickerSchema);