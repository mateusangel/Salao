const mongose = require("mongoose");

const Register = new mongose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },

    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongose.model("User", Register);

module.exports = User;
