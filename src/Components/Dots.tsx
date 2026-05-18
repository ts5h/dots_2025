import { isMobile } from "react-device-detect";
import { ariadne } from "@/vo/Ariadne";
import Styles from "@/styles/Dots.module.scss";
import { useCallback, useEffect, useRef } from "react";
import { useMouse } from "@uidotdev/usehooks";

export const Dots = () => {
	const [mouse, ref] = useMouse();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const frameRef = useRef(0);
	const requestRef = useRef<number>(undefined);

	const dots = ariadne;
	const offsetX = Math.floor((window.innerWidth - 300) / 2);
	const offsetY = Math.floor((window.innerHeight - 340) / 2);

	const init = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			// x, y, toX, toY, currentX, currentY, completeFlag
			dots[i][2] = dots[i][0] + offsetX;
			dots[i][3] = dots[i][1] + offsetY;
			dots[i][4] = Math.floor(Math.random() * window.innerWidth);
			dots[i][5] = Math.floor(Math.random() * window.innerHeight);
			dots[i][6] = 0;
		}
	}, []);

	const animate = useCallback(() => {
		if (!canvasRef.current) {
			requestRef.current = requestAnimationFrame(animate);
			frameRef.current++;
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			requestRef.current = requestAnimationFrame(animate);
			frameRef.current++;
			return;
		}

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = "#000";

		for (let i = 0; i < dots.length; i++) {
			const currentX = dots[i][4];
			const currentY = dots[i][5];

			ctx.fillRect(currentX, currentY, 1, 1);

			if (dots[i][6]) continue;

			const distX = dots[i][2] - dots[i][4];
			const distY = dots[i][3] - dots[i][5];

			if (Math.abs(distX) < 1 && Math.abs(distY) < 1) {
				dots[i][4] = dots[i][2];
				dots[i][5] = dots[i][3];
				dots[i][6] = 1;
			} else {
				dots[i][4] = (dots[i][2] - dots[i][4]) / 4 + dots[i][4];
				dots[i][5] = (dots[i][3] - dots[i][5]) / 4 + dots[i][5];
			}
		}

		requestRef.current = requestAnimationFrame(animate);
		frameRef.current++;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		init();
		animate();

		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	return (
		// @ts-ignore
		<div className={Styles.container} ref={ref}>
			<canvas
				id={"dots"}
				width={canvasWidth}
				height={canvasHeight}
				ref={canvasRef}
			/>
		</div>
	);
};
