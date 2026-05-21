import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { isMobile } from "react-device-detect";
import { agrippa } from "@/vo/Agrippa";
import { ariadne } from "@/vo/Ariadne";
import { laocoon } from "@/vo/Laocoon";
import { getEasedCoordinates } from "@/functions/getEasedCoordinates";
import Styles from "@/styles/Dots.module.scss";

export const Dots = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const breakFlag = useRef(false);
	const requestRef = useRef<number>(undefined);

	const getMax = useCallback((isOutside: boolean = false) => {
		const max = Math.max(window.innerWidth, window.innerHeight);
		let x: number;
		let y: number;

		if (isOutside) {
			const tmpX = Math.random() * 40 - 20;
			const tmpY = Math.random() * 40 - 20;

			if (Math.floor(Math.random() * 2) === 1) {
				x = tmpX < 0 ? tmpX : window.innerWidth + tmpX;
				y = Math.random() * (max - 40) - 20;
			} else {
				x = Math.random() * (max - 40) - 20;
				y = tmpY < 0 ? tmpY : window.innerHeight + tmpY;
			}
		} else {
			x = Math.random() * (max - 40) - 20;
			y = Math.random() * (max - 40) - 20;
		}

		return { x, y };
	}, []);

	const dotsNumber = useRef(0);
	const dotsArray = useMemo(() => [agrippa, ariadne, laocoon], []);
	const [dots, setDots] = useState(dotsArray[0]);

	const setDotsArray = useCallback(
		(isInit: boolean = false) => {
			const tmpDots = dots;

			if (!isInit) {
				dotsNumber.current++;
				if (dotsNumber.current > dotsArray.length - 1) {
					dotsNumber.current = 0;
				}
			}

			const num = dotsNumber.current;

			for (let i = 0; i < dotsArray[num].length; i++) {
				let currentX = 0;
				let currentY = 0;

				if (isInit) {
					const { x, y } = getMax(false);
					currentX = x;
					currentY = y;
				} else if (!tmpDots[i]) {
					const { x, y } = getMax(true);
					currentX = x;
					currentY = y;
				} else {
					currentX = tmpDots[i][6];
					currentY = tmpDots[i][7];
				}

				const tmpArray = [];
				const startX = dotsArray[num][i][0];
				const startY = dotsArray[num][i][1];

				// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
				tmpArray[0] = startX;
				tmpArray[1] = startY;

				tmpArray[2] = currentX;
				tmpArray[3] = currentY;

				tmpArray[4] = startX + Math.floor((window.innerWidth - 300) / 2);
				tmpArray[5] = startY + Math.floor((window.innerHeight - 340) / 2);

				tmpArray[6] = currentX;
				tmpArray[7] = currentY;

				tmpArray[8] = Math.floor(Math.random() * 220 + 20);
				tmpArray[9] = 0;

				tmpDots[i] = tmpArray;
			}

			setDots(tmpDots);
		},
		[getMax, dotsArray, dots],
	);

	const breakInit = useCallback(() => {
		for (let i = 0; i < dots.length; i++) {
			const { x, y } = getMax(false);

			// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration, num
			dots[i][2] = dots[i][6];
			dots[i][3] = dots[i][7];

			dots[i][4] = x;
			dots[i][5] = y;

			// dots[i][6] = dots[i][6];
			// dots[i][7] = dots[i][7];

			dots[i][8] = 24;
			dots[i][9] = 0;
		}

		breakFlag.current = true;
	}, [getMax, dots]);

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

			dots[i][9]++;
		}

		// Move designated positions after break
		if (
			breakFlag.current &&
			dots[dots.length - 1][8] <= dots[dots.length - 1][9]
		) {
			setDotsArray(false);
			breakFlag.current = false;
		}

		requestRef.current = requestAnimationFrame(animate);
	}, [canvasWidth, canvasHeight, setDotsArray, dots]);

	const click = useCallback(() => {
		if (requestRef.current) {
			cancelAnimationFrame(requestRef.current);
		}

		breakInit();
		requestRef.current = requestAnimationFrame(animate);
	}, [animate, breakInit]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
	useEffect(() => {
		setDotsArray(true);
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
