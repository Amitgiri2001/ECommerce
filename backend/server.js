const app = require("./app");
const dotenv = require("dotenv");//this is a file where we can store the protected things
const cloudinary = require("cloudinary");


// uncaught error
// like console.log(you);

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err}`);
    console.log("The server is shutting down Due to Invalid variable name.");
    process.exit(1);
});

const connectDatabase = require("./config/database");

// config ->connect the dotenv file
dotenv.config({ path: "backend/config/config.env" });

// connect database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  



const server=app.listen(process.env.PORT, () => {
    console.log(`Server is working on https://localhost:${process.env.PORT}`);
});

// unhandled promise error->for invalid mongo db string
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err}`);
    console.log("The server is shutting down Due to Invalid string.");

    server.close(()=>{
        process.exit(1);
    });
});
