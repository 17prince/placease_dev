function CustomSelectInput({ value, label, optionList, defaultMessage }) {
  return (
    <>
      <div className="flex-container flex-column gap-02rem">
        <label>{label}</label>
        <select placeholder="eg. Indore" value={value}>
          <option class="placeholder" value="" disabled selected>
            {defaultMessage}
          </option>
          {optionList.map((obj) => (
            <option value={obj.city}>{obj.city}</option>
          ))}
        </select>
      </div>
    </>
  );
}
export default CustomSelectInput;
