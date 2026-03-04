import { verify } from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { secret } from "./secret";

export default function admin(req, res) {
  const cookie = getCookie("auth", { req, res });

  verify(getCookie("auth", { req, res }), secret, function (err, decoded) {
    if (decoded && !err) {
      if (cookie === undefined) {
        res.status(200).json({ msg: "uprawnienia przyznane" });
      }
    }
    if (cookie !== undefined) {
      res.status(300).json({ msg: "coockie istnieje" });
    } else {
      res.status(403).json({ msg: "coockie istnieje" });
    }
  });
}
