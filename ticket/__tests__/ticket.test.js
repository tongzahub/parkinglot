
const request = require('supertest')
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const validate = require("validate.js");
const { async } = require('validate.js');
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

app.post('/ticket', async function(req, res) {
    const { numberPlate, carSize } = req.body.data;
    let validateInput = await validate({ numberPlate, carSize }, constraints);
    if (validateInput) {
      let meassageError = {
        body: validateInput,
        errorCode: 10,
      };
      res.status(400).json(meassageError);
    }else {
      res.status(200).json({
        "_id": "5fe6f1d305e742b26b0bcdf9",
        "numberPlate": "AA",
        "carSize": "S",
        "timeStampIn": "2020-12-26T15:18:27+07:00",
        "__v": 0
    });
  
    }

});
 

describe('Api Tick Endpoints', () => {
  it('Correct Params Case CarSize', async () => {
    const res = await request(app)
    .post('/ticket')
    .send({data:{
      carSize: "S",
      numberPlate:"A"
    }})
    expect(res.statusCode).toEqual(200)
  })
  it('InCorrect Params Case CarSize', async () => {
    const res = await request(app)
    .post('/ticket')
    .send({data:{
      carSize: "A",
      numberPlate:"A"
    }})
    expect(res.statusCode).toEqual(400)
  })
})