import feather from "../../assets/FeatherIcon.png";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faUser,
  faEnvelope,
  faLock,
  faUniversity,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";
import "./Register.css";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://clubstop.onrender.com';

interface University {
  name: string;
}

const Register = () => {
  const navigate = useNavigate();
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [unis, setUnis] = useState<University[] | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<University | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [user, setUser] = useState<string>("");
  const [validName, setValidName] = useState<boolean>(false);
  const [userFocus, setUserFocus] = useState<boolean>(false);
  const { login, isAuthenticated } = useAuth();

  const [pwd, setPwd] = useState<string>("");
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);

  const [email, setEmail] = useState("");

  const [matchPwd, setMatchPwd] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  const [validEmail, setValidEmail] = useState(false);

  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchUniData = async () => {
      const result = await fetch(`${backendUrl}/api/university`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await result.json();

      if (data.success) {
        setUnis(data.unis);
        console.log("success");
      } else {
        console.log(data.error);
      }
    };
    fetchUniData();
  }, []);

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("trying to register");

    const isUserValid = USER_REGEX.test(user);
    const isPwdValid = PWD_REGEX.test(pwd);
    if (!isUserValid || !isPwdValid) {
      setErrMsg("Invalid Entry");
      return;
    }

    if (pwd !== matchPwd) {
      setErrMsg("Passwords do not match");
      return;
    }

    setErrMsg("");
    setSuccess(false);

    try {
      console.log("trying to register");
      const response = await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: user, password: pwd, email: email, school: selected?.name }),
      });

      const data = await response.json();
      console.log(data.success);

      if (data.success) {
        login({
          user: data.user,
          school: data.school
        });
        setUser("");
        setPwd("");
        setMatchPwd("");
        setEmail("");
        navigate("/");
        setSuccess(true);
      } else {
        console.log(data.error);
        setErrMsg(data.error);
      }
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      if (errRef.current) errRef.current.focus();
    }
  };

  const filteredUnis = unis?.filter(u => u.name.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 5);

  const handleUniversitySelect = (uni: University) => {
    setSelected(uni);
    setSearch(uni.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(true);
    if (!e.target.value) {
      setSelected(null);
    }
  };

  return (
    <div className="register-container">
      <div className="background-decoration">
        <img src={feather} alt="" />
      </div>
      
      <div className="register-card">
        {success ? (
          <div className="success-section">
            <h1 className="success-title">Welcome Aboard! 🎉</h1>
            <p className="success-description">
              Your account has been created successfully. You're now part of the community!
            </p>
            <button onClick={() => navigate("/login")} className="club-link-button">
              Continue to Sign In
            </button>
          </div>
        ) : (
          <>
            <div className="form-header">
              <h1 className="form-title">Join the Community</h1>
              <p className="form-subtitle">Create your account and start connecting</p>
            </div>

            {errMsg && (
              <div ref={errRef} className="error-message" aria-live="assertive">
                {errMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  <FontAwesomeIcon icon={faUser} className="label-icon" />
                  Username
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`validation-icon ${validName ? "valid" : "hide"}`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`validation-icon ${validName || !user ? "hide" : "invalid"}`}
                  />
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  className="text-input"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  placeholder="Enter your username"
                />
                {userFocus && user && !validName && (
                  <div id="uidnote" className="instructions">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <FontAwesomeIcon icon={faEnvelope} className="label-icon" />
                  Email Address
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`validation-icon ${validEmail ? "valid" : "hide"}`}
                  />
                </label>
                <input
                  type="email"
                  id="email"
                  className="text-input"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <FontAwesomeIcon icon={faLock} className="label-icon" />
                  Password
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`validation-icon ${validPwd ? "valid" : "hide"}`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`validation-icon ${validPwd || !pwd ? "hide" : "invalid"}`}
                  />
                </label>
                <input
                  type="password"
                  id="password"
                  className="text-input"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  placeholder="Create a strong password"
                />
                {pwdFocus && !validPwd && (
                  <div id="pwdnote" className="instructions">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character (! @ # $ %).
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirm_pwd" className="input-label">
                  <FontAwesomeIcon icon={faLock} className="label-icon" />
                  Confirm Password
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`validation-icon ${validMatch && matchPwd ? "valid" : "hide"}`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`validation-icon ${validMatch || !matchPwd ? "hide" : "invalid"}`}
                  />
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  className="text-input"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  placeholder="Confirm your password"
                />
                {matchFocus && !validMatch && (
                  <div id="confirmnote" className="instructions">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="school" className="input-label">
                  <FontAwesomeIcon icon={faUniversity} className="label-icon" />
                  University
                </label>
                <div className="university-search-container">
                  <div className="search-input-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      className="text-input university-search"
                      placeholder="Search universities..."
                      value={search}
                      onChange={handleSearchChange}
                      onFocus={() => setShowDropdown(true)}
                    />
                  </div>
                  {showDropdown && filteredUnis && filteredUnis.length > 0 && (
                    <div className="university-dropdown">
                      {filteredUnis.map((uni, idx) => (
                        <div
                          key={idx}
                          className="university-option"
                          onClick={() => handleUniversitySelect(uni)}
                        >
                          {uni.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selected && (
                  <div className="selected-university">
                    <FontAwesomeIcon icon={faCheck} className="selected-icon" />
                    <span>{selected.name}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="submit-button"
                disabled={!validName || !validPwd || !validMatch || !validEmail || !selected}
              >
                Create Account
              </button>
            </form>

            <div className="login-link-section">
              <p className="login-text">Already have an account?</p>
              <button 
                onClick={() => navigate("/login")} 
                className="login-link-button"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;