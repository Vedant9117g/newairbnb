const mongoose = require("mongoose");
const { Schema } = mongoose;
// const Review = require('./review.js');

const defaultImg = "https://img.freepik.com/free-vector/wanderlust-explore-adventure-landscape_24908-55313.jpg";

const imageSchema = new Schema({
  filename: String,
  url: {
    type: String,
    default: defaultImg,
    set: (v) => (v === "" ? defaultImg : v),
  },
});

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: imageSchema,
    default: { url: defaultImg },
  },
  price: { type: Number, required: true },
  location: { type: String, required: true, set: (v) => v.toUpperCase() },
  country: { type: String, set: (v) => v.toUpperCase() },
  // reviews: [
  //     {
  //         type: Schema.Types.ObjectId,
  //         ref: "Review",
  //     },
  // ],
});

// listingSchema.post('findOneAndDelete', async (listing) => {
//     if (listing) {
//         await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });

module.exports = mongoose.model("Listing", listingSchema);