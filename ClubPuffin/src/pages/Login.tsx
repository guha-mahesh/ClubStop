//the Login Page

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import feather from "../../src/assets/FeatherIcon.png";

axios.defaults.baseURL = "";
const SIGNIN_URL = "/Signin";

const Login = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null); // Fix ref type

  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success || localStorage.getItem("signed") === "true") {
      navigate("/");
    }
  }, [navigate, success]);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  interface SignInResponse {
    message: string;
    token: string;
    username: string;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<SignInResponse>(
        SIGNIN_URL,
        { user, pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.username);
      localStorage.setItem("signed", "true");
      setSuccess(true);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.message || "Invalid Username or Password");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <>
      <div className="allRegister">
        <img className="logInFeather" src={feather} />
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <br />
            <p>
              <a href="/">Go • to • Home</a>
            </p>
          </section>
        ) : (
          <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
              {errMsg}
            </p>
            <h1 className="registerHeading">Sign In</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />

              <button type="submit">Sign In</button>
            </form>
            <p>
              Need an Account?
              <br />
              <span className="line">
                <a href="/Register">Sign Up</a>
              </span>
            </p>
          </section>
        )}
        <img className="logInFeather" id="logInfeather2" src={feather} />
      </div>
    </>
  );
};

export default Login;
