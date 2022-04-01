import { useState, useMemo, useEffect } from "react";
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
import Dropdown from "../../components/core/Dropdown";

function Setting({ type, option, label, options }) {
  const { userData, setUserDataKey } = useUserData();
  console.log(userData);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (userData === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    setValue(
      type === "choice"
        ? options.filter((obj) => {
            return obj.value === userData?.[option];
          })[0]
        : userData?.[option]
    );
  }, [userData]);

  // const [value, setValue] = useState("a");

  const handleSave = () => {
    if (type === "text") {
      setUserDataKey({ [option]: value });
    }
    if (type === "choice") {
      setUserDataKey({ [option]: value.value });
    }
  };
  if (type === "text")
    return (
      <Input
        className={[styles.settingInput, loading && styles.loading].join(" ")}
        value={value}
        label={label}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        after={
          <Button
            onClick={handleSave}
            style={{ marginLeft: "0.5rem" }}
            {...(userData?.[option] === value ? { disabled: true } : null)}
          >
            Save
          </Button>
        }
        {...(!userData && { loading: true })}
      />
    );
  if (type === "choice") {
    return (
      <Input
        customInput={
          <Dropdown
            value={value}
            options={options}
            onChange={(e) => setValue(e)}
            placeholder={label}
            maxWidth="unset"
          />
        }
        className={[styles.settingInput, loading && styles.loading].join(" ")}
        value={value}
        label={label}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        after={
          <Button
            onClick={handleSave}
            style={{ marginLeft: "0.5rem" }}
            {...(userData?.[option] === value?.value
              ? { disabled: true }
              : null)}
          >
            Save
          </Button>
        }
        {...(!userData && { loading: true })}
      />
    );
  }

  return null;
}

export default Setting;
