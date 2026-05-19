import { isMobile } from "react-device-detect";
import { ariadne } from "@/vo/Ariadne";
import Styles from "@/styles/Dots.module.scss";
import { useCallback, useEffect, useRef } from "react";

export const Dots = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const requestRef = useRef<number>(undefined);

	const dots = ariadne;
	const offsetX = Math.floor((window.innerWidth - 300) / 2);
	const offsetY = Math.floor((window.innerHeight - 340) / 2);

	const init = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			// x, y, toX, toY, currentX, currentY, startFlag, completeFlag, speed
			dots[i][2] = dots[i][0] + offsetX;
			dots[i][3] = dots[i][1] + offsetY;
			dots[i][4] = Math.random() * window.innerWidth;
			dots[i][5] = Math.random() * window.innerHeight;
			dots[i][6] = 0;
			dots[i][7] = Math.random() * 28 + 2;
		}
	}, [offsetX, offsetY]);

	const breakInit = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			// x, y, toX, toY
			dots[i][4] = dots[i][2];
			dots[i][5] = dots[i][3];
			dots[i][6] = 0;
			dots[i][7] = 4;

			dots[i][2] = Math.random() * window.innerWidth;
			dots[i][3] = Math.random() * window.innerHeight;
		}
	}, []);

	const animate = useCallback(() => {
		if (!canvasRef.current) {
			requestRef.current = requestAnimationFrame(animate);
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			requestRef.current = requestAnimationFrame(animate);
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

			if (Math.abs(distX) < 2 && Math.abs(distY) < 2) {
				dots[i][4] = dots[i][2];
				dots[i][5] = dots[i][3];
				dots[i][6] = 0;
				dots[i][7] = 1;
			} else {
				dots[i][4] = (dots[i][2] - dots[i][4]) / dots[i][7] + dots[i][4];
				dots[i][5] = (dots[i][3] - dots[i][5]) / dots[i][7] + dots[i][5];
			}
		}

		requestRef.current = requestAnimationFrame(animate);
	}, [canvasWidth, canvasHeight]);

	const click = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
		}

		animate();
	}, [animate]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		init();
		window.addEventListener("click", click);

		return () => {
			if (requestRef.current) {
				window.removeEventListener("click", click);
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	return (
		// @ts-expect-error
		<div className={Styles.container}>
			<canvas
				id={"dots"}
				width={canvasWidth}
				height={canvasHeight}
				ref={canvasRef}
			/>
		</div>
	);
};
