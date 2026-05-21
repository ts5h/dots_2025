import { useCallback, useEffect, useMemo, useRef } from "react";
import { isMobile } from "react-device-detect";
import { ariadne } from "@/vo/Ariadne";
import { laocoon } from "@/vo/Laocoon";
import { agrippa } from "@/vo/Agrippa.ts";
import { getEasedCoordinates } from "@/functions/getEasedCoordinates";
import Styles from "@/styles/Dots.module.scss";

export const Dots = () => {
	const startedFlag = useRef(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const breakFlag = useRef(false);
	const requestRef = useRef<number>(undefined);

	const dotsNumber = useRef(0);

	const dotsArrays = useMemo(() => [agrippa, ariadne, laocoon], []);

	const getDots = useCallback(
		(isReset: boolean = false) => {
			if (isReset) {
				dotsNumber.current++;

				if (dotsNumber.current > dotsArrays.length - 1) {
					dotsNumber.current = 0;
				}
			}

			return dotsArrays[dotsNumber.current];
		},
		[dotsArrays],
	);

	const getMax = useCallback(() => {
		const max = Math.max(window.innerWidth, window.innerHeight);
		return Math.random() * (max + 20) - 10;
	}, []);

	const toInit = useCallback(() => {
		const dots = getDots();
		for (let i = 0; i < dots.length; i++) {
			// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
			dots[i][2] = !startedFlag.current ? getMax() : dots[i][4];
			dots[i][3] = !startedFlag.current ? getMax() : dots[i][5];

			dots[i][4] = dots[i][0] + Math.floor((window.innerWidth - 300) / 2);
			dots[i][5] = dots[i][1] + Math.floor((window.innerHeight - 340) / 2);

			dots[i][6] = dots[i][2];
			dots[i][7] = dots[i][3];

			dots[i][8] = Math.floor(Math.random() * 220 + 20);
			dots[i][9] = 0;
		}
	}, [getDots, getMax]);

	const breakInit = useCallback(() => {
		const dots = getDots();
		for (let i = 0; i < dots.length; i++) {
			// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
			dots[i][2] = dots[i][6];
			dots[i][3] = dots[i][7];

			dots[i][4] = getMax();
			dots[i][5] = getMax();

			dots[i][8] = 24;
			dots[i][9] = 0;
		}

		breakFlag.current = true;
	}, [getDots, getMax]);

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

		const dots = getDots();

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = "#000";

		for (let i = 0; i < dots.length; i++) {
			const { currentX, currentY } = getEasedCoordinates({
				startX: dots[i][2],
				startY: dots[i][3],
				endX: dots[i][4],
				endY: dots[i][5],
				duration: dots[i][8],
				currentDuration: dots[i][9],
				isBreaking: breakFlag.current,
			});

			ctx.fillRect(currentX, currentY, 1, 1);

			dots[i][6] = currentX;
			dots[i][7] = currentY;

			if (dots[i][8] > dots[i][9]) dots[i][9]++;
		}

		// Move designated positions after break
		if (
			breakFlag.current &&
			dots[dots.length - 1][8] === dots[dots.length - 1][9]
		) {
			toInit();
			breakFlag.current = false;
		}

		requestRef.current = requestAnimationFrame(animate);
	}, [toInit, getDots, canvasWidth, canvasHeight]);

	const click = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
			requestRef.current = undefined;
		}

		getDots(true);
		toInit();
		breakInit();

		// FIXME: flag position
		startedFlag.current = true;
		requestRef.current = requestAnimationFrame(animate);
	}, [animate, toInit, breakInit, getDots]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		toInit();
		requestRef.current = requestAnimationFrame(animate);
		document.addEventListener("click", click);

		return () => {
			if (requestRef.current) {
				document.removeEventListener("click", click);
				cancelAnimationFrame(requestRef.current);
				requestRef.current = undefined;
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
