import Styles from "@/styles/Menu.module.scss";
import { MenuButtonGitHub } from "./Button/GitHub";
import { MenuButtonReload } from "./Button/Reload";

export const Menu = () => {
	return (
		<div className={Styles.wrapper}>
			<nav className={Styles.nav}>
				<MenuButtonReload />
				<MenuButtonGitHub />
			</nav>
		</div>
	);
};
