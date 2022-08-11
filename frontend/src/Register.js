import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [btndisable, setDisable] = useState(false);

  const navigate = useNavigate();

  const next=()=>{
    navigate("/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDisable(true);
    try {
      const { data } = await axios.post("http://localhost:5000/user/signup", {
        email,
        password,
      });
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("userData", JSON.stringify(data.email));
      navigate("/drawing");
      setDisable(false);
    } catch (error) {
      setDisable(false);
      setError(error.message);
    }
  };
  return (
    <div className={styles.login__main}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h3>Register</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={btndisable}
          >
            Submit
          </button>
        </div>
        <p className="forgot-password text-right" style={{marginTop:"1rem"}}>
          Already have an account? <span style={{color:"blue",cursor:"pointer"}} onClick={next}>Login</span>
        </p>
        <div style={{ color: "red" }}>{error}</div>
      </form>
    </div>
  );
};
export default Register;
