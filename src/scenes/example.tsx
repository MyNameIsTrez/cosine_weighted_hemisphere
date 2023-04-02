import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Grid, Rect, Line, Node } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { CodeBlock, insert, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
// import { tween } from '@motion-canvas/core/lib/tweening';
// import { DEFAULT, createSignal } from '@motion-canvas/core/lib/signals';
import { Vector2 } from '@motion-canvas/core/lib/types';

const GRAY = '#2a2a2a';
const LIGHT_GRAY = '#444444';
const WHITE = '#F2F2F2'
const RED = '#F22a2a'

export default makeScene2D(function* (view) {
	view.fill(GRAY);

	const gridRef = createRef<Grid>();
	view.add(<Grid ref={gridRef}
		width={view.width}
		height={view.height}
		spacing={200}
		stroke={LIGHT_GRAY}
		lineWidth={4}
		opacity={0}
		lineDash={[15]}
		// lineDashOffset={20}
		// lineCap="round"
	/>);

	const normalRef = createRef<Line>();
	const surfaceRef = createRef<Line>();
	const group = createRef<Node>();
	view.add(
		<Node ref={group} y={200}>
			<Line ref={normalRef}
				points={[new Vector2(0, 0), new Vector2(0, -200)]}
				stroke={RED}
				lineWidth={10}
				endArrow
				end={0}
			/>
			<Line ref={surfaceRef}
				points={[new Vector2(-400, 0), new Vector2(400, 0)]}
				stroke={WHITE}
				lineWidth={20}
				lineCap={'round'}
				opacity={0}
			/>
		</Node>
	);

	const rectRef = createRef<Rect>();
	view.add(<Rect ref={rectRef}
		fill={GRAY}
		width={view.width}
		height={400}
		y={-840}
	/>);

	const codeRef = createRef<CodeBlock>();
	yield view.add(<CodeBlock ref={codeRef}
		language="tsx"
		code={`ray.dir = plane.normal;`}
		y={-740}
	/>);

	yield* gridRef().opacity(1, 1.5);
	yield* waitFor(0.6);
	yield* surfaceRef().opacity(1, 1.5);
	yield* waitFor(0.4);
	yield* normalRef().end(1, 1.5);
	yield* waitFor(0.6);
	yield* group().rotation(30, 1.5).to(0, 1.5);
	yield* waitFor(0.6);
	yield* all(
		rectRef().position.y(-540, 2),
		codeRef().position.y(-440, 2)
	);
	yield* waitFor(0.6);
	yield* codeRef().edit(1.2)`ray.dir = plane.normal${insert(' + random()')};`;
	yield* waitFor(0.6);
	yield* codeRef().selection(lines(0, Infinity), 1);
	yield* waitFor(0.6);
	yield* codeRef().edit(1.2)`ray.dir = ${insert('normalize(')}plane.normal + random()${insert(')')};`;
	yield* waitFor(0.6);
	yield* codeRef().selection(lines(0, Infinity), 1);
	yield* waitFor(0.6);
	yield* all(
		rectRef().position.y(-840, 0.6),
		codeRef().position.y(-740, 0.6),
		delay(0.1, normalRef().opacity(0, 0.6)),
		delay(0.5, surfaceRef().opacity(0, 0.6)),
		delay(0.9, gridRef().opacity(0, 0.6))
	);
});
