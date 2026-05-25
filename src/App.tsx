import { Dots } from "@/Components/Dots";
import "@/styles/App.css";
import { MenuHome } from "@/Components/Menu/Home";
import { Menu } from "@/Components/Menu";

function App() {
	return (
		<>
			<Dots />
			<MenuHome />
			<Menu repositoryUrl={"https://github.com/ts5h/dots_2025"} />
		</>
	);
}

export default App;
