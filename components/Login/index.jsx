import { useState, useEffect } from "react";
import {
  appSignInWithGoogle,
  appSignOut,
  appSignInWithEmailAndPassword,
  appSignUpWithEmailAndPassword,
} from "../../services/firebase";
import styled from "styled-components";
import Input from "../core/Input";
import InputWithLabel from "../core/Input/InputWithLabel";
import Button from "../core/Button";
import { useAuth } from "../../services/auth";
import styles from "./login.module.scss";
import Card from "../core/Card";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authUser = useAuth();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [isRegister]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.login}>
          <InputWithLabel
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // placeholder="Email Address"
          />
          <InputWithLabel
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // placeholder="Password"
          />
          {!isRegister ? (
            <>
              <Button
                onClick={() => appSignInWithEmailAndPassword(email, password)}
              >
                Log in
              </Button>
              <Button
                className="button"
                onClick={appSignInWithGoogle}
                type="button"
              >
                Log in with Google
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => appSignUpWithEmailAndPassword(email, password)}
              >
                Sign up
              </Button>
              <Button
                className="button"
                onClick={appSignInWithGoogle}
                type="button"
              >
                Sign up with Google
              </Button>
            </>
          )}
          {/* <Button className="button" onClick={appSignOut} type="button">
            Sign Out
          </Button> */}
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsRegister(!isRegister)}>Log in</button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account yet?{" "}
              <button onClick={() => setIsRegister(!isRegister)}>
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Login;
