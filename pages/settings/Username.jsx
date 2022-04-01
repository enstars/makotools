import { useState, useMemo } from "react";
import Login from "../../components/Login";
import { useAuth } from "../../services/auth";
import { useUserData } from "../../services/userData";
import Title from "../../components/Title";
import Main from "../../components/Main";
import { validateUsernameDb } from "../../services/firebase";
import { useDebouncedCallback } from "use-debounce";
import Input from "../../components/core/Input";
import Button from "../../components/core/Button";
import styles from "./settings.module.scss";

function Username() {
  const { userData, setUserDataKey } = useUserData();
  const [username, setUsername] = useState(userData?.username);
  const [usernameMsg, setUsernameMsg] = useState("");

  const handleUsernameChange = useDebouncedCallback((value) => {
    setUsername(value);
    validateUsername(value);
  }, 400);

  const validateUsername = async (value) => {
    setUsername(value);
    if (value === userData.username) {
      setUsernameMsg("");
    } else if (value.replace(/[A-z0-9_]/g, "").length > 0) {
      setUsernameMsg("Username must only contain alphanumeric characters!");
    } else if (value.length === 0) {
      setUsernameMsg("Username cannot be empty!");
    } else if (value.length < 4) {
      setUsernameMsg("Username too short!");
    } else if (value.length > 15) {
      setUsernameMsg("Username too long!");
    } else {
      const usernameValid = await validateUsernameDb(value);
      if (!usernameValid) {
        setUsernameMsg("Username is taken!");
      } else {
        setUsernameMsg("Username is available!");
      }
    }
  };

  const validateAndSaveUsername = () => {
    setUserDataKey({ username: username });
  };

  const memoizedHandleUsernameChange = useMemo(() => handleUsernameChange, []);
  return (
    <>
      <Input
        className={styles.usernameInput}
        defaultValue={userData?.username}
        label="Username"
        onChange={(e) => {
          memoizedHandleUsernameChange(e.target.value);
        }}
        after={
          <>
            <span className={styles.usernameInputSign}>@</span>
            <Button
              onClick={validateAndSaveUsername}
              {...(usernameMsg === "Username is available!"
                ? null
                : { disabled: true })}
              style={{ marginLeft: "0.5rem" }}
            >
              Save
            </Button>
          </>
        }
        {...(!userData && { loading: true })}
      />
      {usernameMsg && (
        <div
          style={{
            color:
              usernameMsg === "Username is available!"
                ? "var(--wataru)"
                : "var(--tsukasa)",
          }}
        >
          {usernameMsg}
        </div>
      )}
    </>
  );
}

export default Username;
