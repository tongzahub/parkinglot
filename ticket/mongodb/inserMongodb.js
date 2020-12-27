const mongoose = require("mongoose");
const ticket = require("./model/ticketModel");
require("dotenv").config();
var HOST_NAME = process.env.DBHOST;
var DATABASE_NAME = process.env.DBNAME;
module.exports.insertTicker = async (req) => {
    return new Promise((resolve ,reject)=> {
    mongoose.connect("mongodb://" + HOST_NAME + "/" + DATABASE_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;

    connection.once("open", function () {    
 
      ticket.create(req, function (err, result) {
        if (err) {
          console.log(err);
          mongoose.connection.close()
          reject(err)
        } else {
          console.log(result);
          mongoose.connection.close()
          resolve(result)
        }
      });
    });
  });
}


