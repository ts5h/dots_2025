import { isMobile } from "react-device-detect";
import { ariadne } from "@/vo/Ariadne";
import Styles from "@/styles/Dots.module.scss";
import { useCallback, useEffect, useRef } from "react";

export const Dots = () => {
	const startedFlag = useRef(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const dots = ariadne;

	const breakFlag = useRef(false);
	const requestRef = useRef<number>(undefined);

	const toInit = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			// x, y, toX, toY, currentX, currentY, completeFlag, speed
			dots[i][2] = dots[i][0] + Math.floor((window.innerWidth - 300) / 2);
			dots[i][3] = dots[i][1] + Math.floor((window.innerHeight - 340) / 2);
			dots[i][4] = !startedFlag.current
				? Math.random() * window.innerWidth
				: dots[i][4];
			dots[i][5] = !startedFlag.current
				? Math.random() * window.innerHeight
				: dots[i][5];
			dots[i][6] = 0;
			dots[i][7] = Math.random() * 23 + 2;
		}
	}, []);

	const breakInit = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			dots[i][2] = Math.random() * window.innerWidth;
			dots[i][3] = Math.random() * window.innerHeight;

			dots[i][6] = 0;
			dots[i][7] = 4; // speed
		}

		breakFlag.current = true;
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
				dots[i][6] = 1;
			} else {
				dots[i][4] = (dots[i][2] - dots[i][4]) / dots[i][7] + dots[i][4];
				dots[i][5] = (dots[i][3] - dots[i][5]) / dots[i][7] + dots[i][5];
			}
		}

		if (breakFlag.current && dots[0][6]) {
			toInit();
			breakFlag.current = false;
		}

		requestRef.current = requestAnimationFrame(animate);
	}, [canvasWidth, canvasHeight, toInit]);

	const click = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
		}

		if (startedFlag.current) {
			breakInit();
		}

		animate();

		if (!startedFlag.current) {
			startedFlag.current = true;
		}
	}, [animate, breakInit]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		toInit();
		document.addEventListener("click", click);

		return () => {
			if (requestRef.current) {
				document.removeEventListener("click", click);
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	return (
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
