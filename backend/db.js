const mongoose=require("mongoose");

const connectDB=()=>{
    const uri="mongodb+srv://akshayreddyk:admin@cluster0.xfmaxlc.mongodb.net/Chat?retryWrites=true&w=majority";

    try{
        mongoose.connect(uri);
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
    const dbConnection=mongoose.connection;
    dbConnection.once("open",(_)=>{
        console.log(`Database connected: ${uri}`);
    });
    dbConnection.on("erroe",(err)=>{
        console.error(`connection error: ${err}`);
    });
    return;
}

module.exports = connectDB;