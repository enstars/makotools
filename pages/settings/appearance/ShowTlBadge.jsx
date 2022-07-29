import SelectSetting from "../shared/SelectSetting";

const tlBadgeOptions = [
  {
    value: "none",
    label: "Hide all badges",
  },
  {
    value: "unofficial",
    label: "Only show badges for unofficial translations",
  },
  {
    value: "all",
    label: "Show all badges",
  },
];

function ShowTlBadge() {
  return (
    <SelectSetting
      dataKey="show_tl_badge"
      label="Show officialty badges for translations"
      data={tlBadgeOptions}
      description="This setting may not be applied site-wide at this time."
      placeholder={tlBadgeOptions[0].label}
    />
  );
}

export default ShowTlBadge;
