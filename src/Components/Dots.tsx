import { isMobile } from "react-device-detect";
import { ariadne } from "@/vo/Ariadne";
import { laocoon } from "@/vo/Laocoon";
import Styles from "@/styles/Dots.module.scss";
import { useCallback, useEffect, useRef } from "react";
import { getEasedCoordinates } from "@/functions/getEasedCoordinates";

export const Dots = () => {
	const startedFlag = useRef(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const dotsNumber = useRef(0);
	const dotsArrays = [ariadne, laocoon];
	let dots = dotsArrays[dotsNumber.current];

	const breakFlag = useRef(false);
	const requestRef = useRef<number>(undefined);

	const toInit = useCallback(() => {
		const max = Math.max(window.innerWidth, window.innerHeight);

		for (let i = 0; i < dots.length; i++) {
			// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
			dots[i][2] = !startedFlag.current ? Math.random() * max : dots[i][4];
			dots[i][3] = !startedFlag.current ? Math.random() * max : dots[i][5];

			dots[i][4] = dots[i][0] + Math.floor((window.innerWidth - 300) / 2);
			dots[i][5] = dots[i][1] + Math.floor((window.innerHeight - 340) / 2);

			dots[i][6] = dots[i][2];
			dots[i][7] = dots[i][3];

			dots[i][8] = Math.floor(Math.random() * 249 + 1);
			dots[i][9] = 0;
		}
	}, []);

	const breakInit = useCallback(() => {
		const max = Math.max(window.innerWidth, window.innerHeight);

		for (let i = 0; i < dots.length; i++) {
			// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
			dots[i][2] = dots[i][6];
			dots[i][3] = dots[i][7];

			dots[i][4] = Math.random() * max;
			dots[i][5] = Math.random() * max;

			dots[i][8] = 20;
			dots[i][9] = 0;
		}

		breakFlag.current = true;
		startedFlag.current = true;
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
			const { currentX, currentY } = getEasedCoordinates(
				dots[i][2],
				dots[i][3],
				dots[i][4],
				dots[i][5],
				dots[i][8],
				dots[i][9],
				breakFlag.current,
			);

			ctx.fillRect(currentX, currentY, 1, 1);
			dots[i][6] = currentX;
			dots[i][7] = currentY;

			if (dots[i][8] > dots[i][9]) dots[i][9]++;
		}

		// Set dots after break
		if (
			breakFlag.current &&
			dots[dots.length - 1][8] === dots[dots.length - 1][9]
		) {
			toInit();
			breakFlag.current = false;
		}

		requestRef.current = requestAnimationFrame(animate);
	}, [toInit, canvasWidth, canvasHeight]);

	const click = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
			requestRef.current = undefined;
		}

		dotsNumber.current++;
		if (dotsNumber.current > dotsArrays.length - 1) {
			dotsNumber.current = 0;
		}

		dots = dotsArrays[dotsNumber.current];

		toInit();
		breakInit();

		requestRef.current = requestAnimationFrame(animate);
	}, [animate, toInit, breakInit]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		toInit();
		requestRef.current = requestAnimationFrame(animate);

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
