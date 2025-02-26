import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";

const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
