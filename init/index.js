const mongoose=require("mongoose");
const initData=require("./data.js");
const listing =require("../models/listing.js");

main()
.then(()=>{
    console.log("successfull");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
const initdb=async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data was initialized");
}
initdb();