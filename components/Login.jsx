import { useState } from "react";
import {
  appSignInWithGoogle,
  appSignOut,
  appSignInWithEmailAndPassword,
  appSignUpWithEmailAndPassword,
} from "../services/firebase";
import styled from "styled-components";

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <LoginWrapper>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail Address"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={() => appSignInWithEmailAndPassword(email, password)}>
        Login
      </button>
      <button onClick={() => appSignUpWithEmailAndPassword(email, password)}>
        Register
      </button>
      <button className="button" onClick={appSignInWithGoogle} type="button">
        Sign in with google
      </button>
      <button className="button" onClick={appSignOut} type="button">
        Sign Out
      </button>
    </LoginWrapper>
  );
}
export default Login;
