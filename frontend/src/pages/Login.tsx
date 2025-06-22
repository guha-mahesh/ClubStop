//the Login Page

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import feather from "../../src/assets/FeatherIcon.png";
import { useAuth } from "../contexts/AuthContexts";




const Login = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null); 

  const [username, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const {login, user, isAuthenticated} = useAuth();

  useEffect(() => {
    if (success || user || isAuthenticated) {
      navigate("/");
    }
  }, [navigate, success, user]);

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
      const response = await fetch("http://localhost:5000/api/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: pwd }),
    });
    const data = await response.json();
    if (data.success){
      login({
        token: data.token,
        user: data.user
      })
      navigate("/")
    }




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
                value={username}
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
