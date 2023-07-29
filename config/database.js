const mongoose = require('mongoose');

MONGO_URI = ''; //replace your mongoDB address

exports.connect = (()=>{
  mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Stupid Driver Loaded 💩");
  })
  .catch((error) => {
    console.log("Can't Connect Baby ☠️", error);
  });

})