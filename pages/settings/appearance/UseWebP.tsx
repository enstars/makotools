import SelectSetting from "../shared/SelectSetting";

const webpOptions = [
  {
    value: "use",
    label: "Use WebPs wherever possible",
  },
  {
    value: "dont-use",
    label: "Don't use WebPs at all",
  },
];

function UseWebP() {
  return (
    <SelectSetting
      dataKey="setting__use_webp"
      label="Use WebPs to optimize images"
      data={webpOptions}
      description="Disabling WebPs may result in slower load times."
      placeholder={webpOptions[0].label}
    />
  );
}

export default UseWebP;
