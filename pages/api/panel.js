import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { secret } from "./secret";

export default function admin(req, res) {
  const cookie = getCookie("auth", { req, res });
  console.log("coockie" + cookie);

  verify(getCookie("auth", { req, res }), secret, function (err, decoded) {
    console.log("jestem w API " + res.statusCode);
    if (decoded && !err) {
      if (cookie === undefined) {
        console.log("działa");
        res.status(200).json({ msg: "uprawnienia przyznane" });
      }
    }
    if (cookie !== undefined) {
      console.log("Twoje coockie istnieje");
      res.status(300).json({ msg: "coockie istnieje" });
    } else {
      console.log("Odmowa");
      res.status(403).json({ msg: "coockie istnieje" });
    }
  });
}
