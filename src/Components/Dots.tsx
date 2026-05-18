import { isMobile } from "react-device-detect";
import Styles from "@/styles/Dots.module.scss";

export const Dots = () => {
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	return (
		<div className={Styles.container}>
			<canvas id={"dots"} width={canvasWidth} height={canvasHeight} />
		</div>
	);
};
