// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose"
import { setCookie } from "cookies-next"
import { compare } from 'bcrypt'
import Users  from '../../model/users'
import { sign } from 'jsonwebtoken'
import { secret } from "./secret"


export default async function connect(req,res) {

  const email = req.body.email
  const pass = req.body.pass

  console.log(email)

  await mongoose.connect(process.env.MONGO_URI);
  console.log("połączono!")
  
  const results = await Users.find({
    email:email,
  })

  if(results.length === 1){
    compare(pass, results[0].pass, async function(err,result){
      if(!err && result){
              const jwt = sign(email, secret);
              setCookie('auth', jwt, { req, res })
              res.status(200).json({msg:"ciastko dodane"})
              console.log("ciastko dodane")
            } else {
              res.status(403).json({msg:"Błędny token"})
            }
    })
  } else {
      res.status(403).json({msg:"dane nie są zgodne"})
      console.log("błedne dane")
    }
  }
