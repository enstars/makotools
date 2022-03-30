import Select from "react-select";

function Dropdown(props) {
  return (
    <Select
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
        }),
      }}
      {...props}
    />
  );
}

export default Dropdown;
