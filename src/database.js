import mongoose from "mongoose";

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB is connected"))
.catch(err=> console.error(err))