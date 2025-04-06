
import { useGlobalContext } from "../Global";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const checkJwt = () => {
  const navigate = useNavigate();
  const { signed, setSigned } = useGlobalContext();
  const token = localStorage.getItem("token");

  if (token) {
    const decode = jwtDecode(token) as { exp: number };
    console.log(signed);

    const time = Date.now() / 1000;

    if (decode.exp < time) {
      localStorage.clear();
      setSigned(false);
      navigate('/Login')
    }
  }
};
