import { useCallback, useMemo, useRef } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { Agrippa } from "@/vo/Agrippa";
import { Ariadne } from "@/vo/Ariadne";
import { Laocoon } from "@/vo/Laocoon";
import { Hermes } from "@/vo/Hermes";
import { Venus } from "@/vo/Venus";
import { David } from "@/vo/David";

export const useDots = () => {
	const dots = useRef<number[][]>([]);

	const dotsNumber = useRef(0);
	const dotsArray = useMemo(
		() => [David, Ariadne, Agrippa, Laocoon, Venus, Hermes],
		[],
	);

	const getMax = useCallback((isOutside: boolean = false) => {
		let x: number;
		let y: number;

		if (isOutside) {
			const tmpX = Math.random() * 40 - 20;
			const tmpY = Math.random() * 40 - 20;

			if (Math.floor(Math.random() * 2) === 1) {
				x = tmpX < 0 ? tmpX : window.innerWidth + tmpX;
				y = Math.random() * (window.innerHeight + 40) - 20;
			} else {
				x = Math.random() * (window.innerWidth + 40) - 20;
				y = tmpY < 0 ? tmpY : window.innerHeight + tmpY;
			}
		} else {
			x = Math.random() * (window.innerWidth + 40) - 20;
			y = Math.random() * (window.innerHeight + 40) - 20;
		}

		return { x, y };
	}, []);

	const setDotsArray = useCallback(
		(isInit = false) => {
			if (!isInit) {
				dotsNumber.current++;
				if (dotsNumber.current > dotsArray.length - 1) {
					dotsNumber.current = 0;
				}
			}

			const oldDots = dots.current;
			const tmpDots = dotsArray[dotsNumber.current];

			for (let i = 0; i < tmpDots.length; i++) {
				let currentX: number;
				let currentY: number;

				if (isInit) {
					const { x, y } = getMax(false);
					currentX = x;
					currentY = y;
				} else if (!oldDots[i]) {
					const { x, y } = getMax(true);
					currentX = x;
					currentY = y;
				} else {
					currentX = oldDots[i][6];
					currentY = oldDots[i][7];
				}

				const tmpLine = [];
				const startX = tmpDots[i][0];
				const startY = tmpDots[i][1];

				// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration
				tmpLine.push(
					startX,
					startY,

					currentX,
					currentY,

					startX + Math.floor((window.innerWidth - 300) / 2),
					startY + Math.floor((window.innerHeight - 340) / 2),

					currentX,
					currentY,

					isMobile && !isTablet
						? Math.floor(Math.random() * 180 + 20)
						: Math.floor(Math.random() * 220 + 20),
					0,
				);

				tmpDots[i] = tmpLine;
			}

			dots.current = tmpDots;
		},
		[dotsArray, getMax],
	);

	const setBreakDotsArray = useCallback(
		(t: number = 24) => {
			const tmpDots = dots.current;

			for (let i = 0; i < tmpDots.length; i++) {
				const { x, y } = getMax(false);

				const tmpLine = tmpDots[i];
				const startX = tmpDots[i][6];
				const startY = tmpDots[i][7];

				// x, y, startX, startY, endX, endY, currentX, currentY, duration, currentDuration, num
				tmpLine[2] = startX;
				tmpLine[3] = startY;

				tmpLine[4] = x;
				tmpLine[5] = y;

				tmpLine[8] = t;
				tmpLine[9] = 0;

				tmpDots[i] = tmpLine;
			}

			dots.current = tmpDots;
		},
		[getMax],
	);

	const updateDotsArray = useCallback(
		(i: number, currentX: number, currentY: number) => {
			const tmpDots = dots.current;
			const tmpLine = tmpDots[i];
			tmpLine[6] = currentX;
			tmpLine[7] = currentY;
			tmpLine[9] += 1;

			tmpDots[i] = tmpLine;
			dots.current = tmpDots;
		},
		[],
	);

	const getDotsArray = useCallback(() => {
		return dots.current;
	}, []);

	return {
		setDotsArray,
		setBreakDotsArray,
		updateDotsArray,
		getDotsArray,
	};
};
