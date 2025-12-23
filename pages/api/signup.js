import React from "react";
import { hash } from "bcrypt";
import mongoose from "mongoose";
import UserSchema from "../../model/users";

export default async function connect(req, res) {
  const email = req.body.email;

  console.log("łączę...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("połączono!");

  const results = await UserSchema.find({
    email: email,
  });

  console.log(results.length);

  if (results.length === 1) {
    res.json("Użytkownik już istnieje!");
    console.log("istnieje");
  } else {
    hash(req.body.pass, 12, async function (err, hash) {
      console.log(hash);
      if (!err) {
        await UserSchema.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
          pass: hash,
        });
      }
    });

    res.json("dodano nowego użytkownika!");
    console.log("dodano");
  }
}
