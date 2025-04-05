import { useGlobalContext } from "../Global";
import { jwtDecode } from "jwt-decode";

const { signed, setSigned } = useGlobalContext();

const token = localStorage.getItem("token");

export const checkJwt = () => {
  if (token) {
    const decode = jwtDecode(token) as { exp: number };
    console.log(signed);

    const time = Date.now() / 1000;

    if (decode.exp < time) {
      localStorage.clear();
      setSigned(false);
      window.location.reload();
    }
  }
};
