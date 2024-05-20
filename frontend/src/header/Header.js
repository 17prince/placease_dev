import Avatar from "../utils/Avatar";
import Logo from "../utils/Logo";
import MenuOption from "./MenuOption";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header>
      <Logo />
      <div className="menu-container">
        <MenuOption>
          <a href="/">Home</a>
        </MenuOption>
        <MenuOption>
          <a href="/companies">Companies</a>
        </MenuOption>
        <MenuOption>
          <a href="/inbox">Inbox</a>
        </MenuOption>
        {user ? (
          <>
            <MenuOption>
              <a href="/logout">Logout</a>
            </MenuOption>
            <a href="/profile">
              <Avatar
                size={48}
                width={40}
                height={40}
                text={user.name.split(" ")[0]}
              />
            </a>
          </>
        ) : (
          <MenuOption>
            <a href="/login">Login</a>
          </MenuOption>
        )}

        {/* <img src="https://i.pravatar.cc/48" alt="Avatar" class="avatar" /> */}
      </div>
    </header>
  );
}
