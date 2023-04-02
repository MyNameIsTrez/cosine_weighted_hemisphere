import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all } from '@motion-canvas/core/lib/flow';
import { Img } from '@motion-canvas/2d/lib/components';

import cursorPng from "../../images/cursor.png";
import handPng from "../../images/hand.png";

export default makeScene2D(function* (view) {
	view.fill("#2a2a2a");

	const myCircle = createRef<Circle>();

	view.add(
		<Circle
			ref={myCircle}
			// try changing these properties:
			x={-800}
			width={140}
			height={140}
			fill="#e13238"
		/>,
	);

	const cursorRef = createRef<Img>();
	view.add(<Img ref={cursorRef} src={cursorPng} scale={0.3} x={10} />);

	const handRef = createRef<Img>();
	view.add(<Img ref={handRef} src={handPng} scale={0.75} x={100} />);

	// yield* all(
	// 	myCircle().position.x(300, 1).to(-300, 1),
	// 	myCircle().fill('#e6a700', 1).to('#e13238', 1),
	// );
	yield* all(
		cursorRef().scale(2.5, 1.5).to(2, 1.5),
		cursorRef().absoluteRotation(90, 1.5).to(0, 1.5),
	);
});
