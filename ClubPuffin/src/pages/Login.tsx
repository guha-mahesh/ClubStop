import { useState, useRef, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
const SIGNIN_URL = "/Signin";

const Login = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null); // Fix ref type

  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        SIGNIN_URL,
        { user, pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log(localStorage);

        setSuccess(true);
      } else if (response.status === 401) {
        setErrMsg("Invalid Username or Password");
        console.log(errMsg);
      }
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      }
    }
  };

  return (
    <>
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
          <h1>Sign In</h1>
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
    </>
  );
};

export default Login;
