export default function TextArea({ disabled, value, onChange }) {
  return (
    <textarea
      rows={10}
      cols={96}
      value={value}
      placeholder={"Describe your project..."}
      onChange={onChange}
      disabled={disabled}
    ></textarea>
  );
}
