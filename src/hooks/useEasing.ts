import { useCallback } from "react";

// function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
// 	// 3次ベジェの数式
// 	const ax = 3.0 * x1 - 3.0 * x2 + 1.0;
// 	const bx = 3.0 * x2 - 6.0 * x1;
// 	const cx = 3.0 * x1;
//
// 	const ay = 3.0 * y1 - 3.0 * y2 + 1.0;
// 	const by = 3.0 * y2 - 6.0 * y1;
// 	const cy = 3.0 * y1;
//
// 	const sampleCurveX = (t: number) => {
// 		return ((ax * t + bx) * t + cx) * t;
// 	}
//
// 	const sampleCurveY = (t: number) => {
// 		return ((ay * t + by) * t + cy) * t;
// 	}
//
// 	const sampleCurveDerivativeX = (t: number) => {
// 		return (3.0 * ax * t + 2.0 * bx) * t + cx;
// 	}
//
// 	// ニュートン法で指定したX（時間）に対するtを求める
// 	const solveCurve = (x: number) => {
// 		let t2 = x;
// 		for (let i = 0; i < 8; i++) {
// 			let x2 = sampleCurveX(t2) - x;
// 			if (Math.abs(x2) < 1e-6) {
// 				return t2;
// 			}
//
// 			let d2 = sampleCurveDerivativeX(t2);
// 			if (Math.abs(d2) < 1e-6) {
// 				break;
// 			}
// 			t2 -= x2 / d2;
// 		}
// 		return t2;
// 	}
//
// 	// 与えられたX（0〜1）に対するY（0〜1）を返す関数を返す
// 	return function(x: number) {
// 		return sampleCurveY(solveCurve(x));
// 	};
// }
//
// const cubicBezierInOut = cubicBezier(1.0, 0.0, 0.8, 1.0);

// 0.0 to 1.0
const easeOutQuad = (t: number) => {
	return 1 - (1 - t) ** 4;
};
const easeInOutQuad = (t: number) => {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

type Props = {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	duration: number;
	currentDuration: number;
	isBreaking: boolean;
};

export const useEasing = () => {
	const getEasedCoordinates = useCallback(
		({
			startX,
			startY,
			endX,
			endY,
			duration,
			currentDuration,
			isBreaking,
		}: Props) => {
			const progress = Math.min(currentDuration / duration, 1);
			const easedProgress = isBreaking
				? easeOutQuad(progress)
				: easeInOutQuad(progress);

			const currentX = startX + (endX - startX) * easedProgress;
			const currentY = startY + (endY - startY) * easedProgress;

			return {
				currentX,
				currentY,
			};
		},
		[],
	);

	return {
		getEasedCoordinates,
	};
};
