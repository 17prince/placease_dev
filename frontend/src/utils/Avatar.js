export default function Avatar({
  size = 48,
  width = 50,
  height = 50,
  utilityClass = "",
  url,
  text,
}) {
  const avatarStyle = {
    url: url || `/images/default.jpg`,
    width,
    height,
    utilityClass,
  };
  return (
    <div className={`flex-container gap-02rem flex-center ${utilityClass}`}>
      <img
        src={avatarStyle.url}
        alt="Avatar"
        className="avatar"
        style={avatarStyle}
      />

      {text && <p>{text}</p>}
    </div>
  );
}
// https://i.pravatar.cc/${size}
