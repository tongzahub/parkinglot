const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const validate = require("validate.js");
const { async } = require("validate.js");
const app = express();

app.use(bodyParser.json());
app.use(cors());

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

app.post("/parking/leave", async function (req, res) {
  try {
    res
      .status(200)
      .json({
        meassage: "Leave Slot Success",
        slotId: "5fe83058c3e52ac5589909a9",
      });

  } catch (error) {
    res.status(400).send(error);
  }
});

describe("Api Tick Endpoints", () => {
    it('Correct Params', async () => {
      const res = await request(app)
      .post('/parking/leave')
      .send({slotId :"5fe83058c3e52ac5589909a9",packingId :"5fe83058c3e52ac5589909a0",slotType:"S"
      })
      expect(res.statusCode).toEqual(200)
    })
});
