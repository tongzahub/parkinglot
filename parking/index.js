const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const moment = require("moment-timezone");
const validate = require("validate.js");

const { initPackingProfile } = require("./mongodb/service/initpackingProfile");
const {
  initPackingMamagement,
} = require("./mongodb/service/initPackingManagement");
const { getPackingStatus } = require("./mongodb/service/getPackingStatus");
const { allocatedByCarSize } = require("./mongodb/service/allocatedByCarSize");
const {
  listNumberPlateBySlotType,
} = require("./mongodb/service/listNumberPlateBySlotType");
const {leavePackingSlot} = require('./mongodb/service/leaveSlot')
const { checkinPackingSlot } = require("./mongodb/service/checkinPackingSlot");
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/parking/status", async (req, res) => {
  try {
    /** expect params { packingId : "5fe81211c665cabcd244b39a"}*/
    const { packingId } = req.query;

    let resMassage = await getPackingStatus({ packingId });

    /**
     * return {currentVehicle In Slot s,m,l and slotStatus}
     */

    res.status(200).send(resMassage);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/parking/numberPlateInSlot", async (req, res) => {
  /**
   * expect params {slotType : "s" ,packingId : ""}
   *
   */

  try {
    // const { slotType, packingId } = req.query;
    const { carSize, packingId } = req.query;
    let slotType = carSize.toLocaleUpperCase()
    let reslistNumberPlateBySlotType = await listNumberPlateBySlotType({
      slotType,
      packingId,
    });
    /** return JsonArray */
    res.status(200).send(reslistNumberPlateBySlotType);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/parking/crete", async (req, res) => {
  try {
    /**
     * expect params { S:10 , M:10 , L: 10 }
     * */
    const { S, M, L } = req.body;

    /**
     * CollectionName PackingProfile
     * create packingprofile
     * sum s,m,l = maximumVehicle
     * currentVehicleInSlot s,m,l = 0
     * statusByslotType s,m,l true|false
     */

    let params = {
      initSlotTypeS: S,
      initSlotTypeM: M,
      initSlotTypeL: L,
      currentVehicleInSlotS: 0,
      currentVehicleInSlotM: 0,
      currentVehicleInSlotL: 0,
      statusByslotTypeS: true,
      statusByslotTypeM: true,
      statusByslotTypeL: true,
    };
    let initProfile = await initPackingProfile(params);
    const { _id } = initProfile;
    console.log("initProfile", initProfile);
    console.log("_id", _id);

    /**
     * CollectionName PackingManagement
     *  init s,m,l
     * { slotIndex : S1 (key)  , slotType : "S", slotStatus : "available | unavailable | reserve" }
     */

    let initPackingslot = await initPackingMamagement({ S, M, L, _id });
    res.status(201).send({ meassage: "Crate Packing Success", packingId: _id });
  } catch (err) {
    console.log("In catch", err);
    res.status(400).send({ errorCode: err.code, errorType: err.name });
  }
});

app.post("/parking/checkin", async (req, res) => {
  /**
   * expect params { packingId : "" , slotId : ""}
   */
  const { slotId } = req.body;

  try {
    await checkinPackingSlot({ slotId });
    res.status(200).send({meassage:"Checkin Success" ,slotId:slotId });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/parking/leave", async (req, res) => {
  /**
   * expect params { slotId: "" }
   */
  try {
      const {slotId,packingId,slotType} = req.body
      await leavePackingSlot({slotId,packingId,slotType})
      res.status(200).send({meassage:"Leave Slot Success" ,slotId:slotId });
  } catch (error) {
    res.status(400).send(error);
  }


});

app.post("/parking/allocatedByCarSize", async (req, res) => {
  try {
    const { packingId, slotType, numberPlate, carSize } = req.body;
    let allocatedSlot = await allocatedByCarSize({
      packingId,
      slotType,
      numberPlate,
      carSize,
    });
    /**
     * expect params { carSize : "" ,numberPlate :""  }
     */
    /**
     * return { ticket , and slotId}
     */
    res.status(200).send(allocatedSlot);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
