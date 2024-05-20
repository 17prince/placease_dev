function CustomTextInput({ value, label, placeholder }) {
  return (
    <>
      <div className="flex-container flex-column gap-02rem">
        <label>{label}</label>
        <input value={value} placeholder={placeholder} />
      </div>
    </>
  );
}
export default CustomTextInput;
