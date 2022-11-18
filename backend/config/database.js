
const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`Mongodb connected successfully on ${data.connection.host}`);
    })
    /*
    // we don't need catch block now because we already handled it in server code
    
    .catch((err) => {
        console.log(err);
    });
    */
}

module.exports = connectDatabase;