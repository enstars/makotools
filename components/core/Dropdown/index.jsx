import dynamic from "next/dynamic";
import Select from "react-select";

const CLRSelect = dynamic(() => import("react-select"), { ssr: false });
function Dropdown(props) {
  return (
    <CLRSelect
      // menuPortalTarget={document?.body || null}
      theme={(theme) => ({
        ...theme,
        borderRadius: "0.25rem",
        colors: {
          ...theme.colors,
          primary25: "var(--ritsu-700)",
          primary: "var(--ritsu-500)",
          neutral80: "var(--ritsu-100)",
          neutral30: "var(--ritsu-500)",
          neutral20: "var(--ritsu-500)",
          neutral0: "var(--ritsu-900)",
        },
      })}
      styles={{
        container: (provided, state) => ({
          ...provided,
          zIndex: 10,
          position: "relative",
          maxWidth: props.maxWidth || 300,
          width: props.width || "auto",
          // display: "flex",
          lineHeight: 1,
          margin: "0.25em 0",
          flex: "1 1 0",
        }),
        option: (provided, state) => ({
          ...provided,
          background: state.isSelected && "var(--ritsu-700)",
          color: "inherit",
        }),

        menuList: (provided, state) => ({
          ...provided,
          border: "solid 1px var(--ritsu-700)",
          borderRadius: "0.25rem",
          padding: 0,
          background: "var(--ritsu-800)",
        }),
        valueContainer: (provided, state) => ({
          ...provided,
          padding: "0.5em 0.75em",
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: 0,
          borderColor: state.isFocused
            ? "var(--ritsu-500)"
            : "var(--ritsu-600)",
          boxShadow: "none",
        }),
        input: (provided, state) => ({
          ...provided,
          padding: 0,
          margin: 0,
        }),
        placeholder: (provided, state) => ({
          ...provided,
          color: "var(--ritsu-600)",
        }),
        menuPortal: (provided, state) => ({
          ...provided,
          zIndex: 999,
        }),
      }}
      {...props}
    />
  );
}

export default Dropdown;
