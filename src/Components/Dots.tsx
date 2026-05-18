import { useWindowSize } from "@uidotdev/usehooks";
import Styles from "@/styles/Dots.module.scss";

export const Dots = () => {
	const size = useWindowSize();
	const windowWidth = size.width ?? 640;
	const windowHeight = size.height ?? 480;

	return (
		<div className={Styles.container}>
			<canvas id={"dots"} width={windowWidth} height={windowHeight} />
		</div>
	);
};
