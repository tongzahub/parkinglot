const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const moment = require("moment-timezone");
const validate = require("validate.js");
const { insertTicker } = require("./mongodb/inserMongodb");

/** */
var constraints = {
  numberPlate: {
    presence: true,
    type: "string",
  },
  carSize: {
    presence: true,
    type: "string",
    inclusion: {
      within: ["S", "M", "L"],
      message: "don't support %{value} right now, sorry",
    },
  },
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

const ticket = {};

app.post("/ticket", async (req, res) => {
  /**
   * create ticket
   * carSize can be  Only S,M,L
   */

  try {
    const { numberPlate, carSize } = req.body.data;

    let validateInput = await validate({ numberPlate, carSize }, constraints);
    if (validateInput) {
      console.log(validateInput);
      let meassageError = {
        body: validateInput,
        errorCode: 10,
      };
      res.status(400).send(meassageError);
    } else {
    
      ticket["numberPlate"] = numberPlate;
      ticket["carSize"] = carSize;
      ticket["timeStampIn"] = moment().tz("Asia/Bangkok").format();
  
      let crateRes = await insertTicker(ticket);
  
      /**
       *  pust event create ticket to pracking serive for update current vehicle in parking lot
       *
       */
  
      res.status(201).send(crateRes);
    }
      
  } catch (error) {
    res.status(400).send(error);
  }
  
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
