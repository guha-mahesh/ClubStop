import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import feather from "../../src/assets/FeatherIcon.png";
import { useAuth } from "../contexts/AuthContexts";
import {
  faUser,
  faLock,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Register/Register.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

const Login = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [username, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (success || user || isAuthenticated) {
      navigate("/");
    }
  }, [navigate, success, user, isAuthenticated]);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg("");

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username, password: pwd }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        login({
          user: data.user,
          school: data.school
        });
        setSuccess(true);

      } else {
        setErrMsg(data.match || "Invalid username or password");
      }
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg(err.response.data.message || "Invalid Username or Password");
      } else {
        setErrMsg("Login Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-decoration">

      </div>
      
      <div className="login-card">
        {success ? (
          <div className="success-section">
            <div className="success-animation">
              <FontAwesomeIcon icon={faSignInAlt} className="success-icon" />
            </div>
            <h1 className="success-title">Welcome Back! 🎉</h1>
            <p className="success-description">
              You're successfully logged in. Redirecting you to your dashboard...
            </p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <>
            <div className="form-header">
              <h1 className="form-title">Welcome Back</h1>
              <p className="form-subtitle">Sign in to your account and continue your journey</p>
            </div>

            {errMsg && (
              <div ref={errRef} className="error-message" aria-live="assertive">
                {errMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  <FontAwesomeIcon icon={faUser} className="label-icon" />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  className="text-input"
                  autoComplete="username"
                  onChange={(e) => setUser(e.target.value)}
                  value={username}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <FontAwesomeIcon icon={faLock} className="label-icon" />
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="text-input"
                  autoComplete="current-password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading || !username || !pwd}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="forgot-password-section">
              <button className="forgot-password-button">
                Forgot your password?
              </button>
            </div>

            <div className="register-link-section">
              <p className="register-text">Don't have an account yet?</p>
              <button 
                onClick={() => navigate("/register")} 
                className="register-link-button"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;