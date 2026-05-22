import { useCallback, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import Styles from "@/styles/Dots.module.scss";
import { useDots } from "@/hooks/useDots";
import { useEasing } from "@/hooks/useEasing";

export const Dots = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasWidth = isMobile ? 4000 : 10000;
	const canvasHeight = isMobile ? 4000 : 10000;

	const breakFlag = useRef(false);
	const requestRef = useRef<number>(undefined);

	const { getEasedCoordinates } = useEasing();
	const { setDotsArray, setBreakDotsArray, updateDotsArray, getDotsArray } =
		useDots();

	const breakInit = useCallback(() => {
		setBreakDotsArray();
		breakFlag.current = true;
	}, [setBreakDotsArray]);

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

		const dots = getDotsArray();

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

			updateDotsArray(i, currentX, currentY);
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
	}, [
		canvasWidth,
		canvasHeight,
		setDotsArray,
		updateDotsArray,
		getDotsArray,
		getEasedCoordinates,
	]);

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
