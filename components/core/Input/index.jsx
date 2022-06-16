import Input from "./Input";
import InputWithLabel from "./InputWithLabel";

function CoreInput(props) {
  if (props.label) return <InputWithLabel {...props} />;
  return <Input {...props} />;
}
export default CoreInput;
