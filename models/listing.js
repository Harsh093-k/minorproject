const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        Url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:[{
    type:Schema.Types.ObjectId,
    ref:"User"
    }],
    geometry: {
        typr:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type: [Number],
            required :true
        }
    },
    category:{
        type:String,
        enum:["Mountain","forest","farming","Beach","lake","rain","ship","sun"],
    },

});

listingSchema.post("findOneAndDelete", async( listing)=>{
    if(listing){
    await Review.deleteMany({_id : { $in: listing.reviews } });
    }
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;