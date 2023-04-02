import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Grid, Rect, Line, Node, Circle } from '@motion-canvas/2d/lib/components';
import { createRef, useLogger } from '@motion-canvas/core/lib/utils';
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { CodeBlock, insert } from '@motion-canvas/2d/lib/components/CodeBlock';
import { tween, map, easeInOutCubic } from '@motion-canvas/core/lib/tweening';

const GRAY = '#2a2a2a';
const LIGHT_GRAY = '#444444';
const WHITE = '#f2f2f2'
const RED = '#f22a2a'
const YELLOW = '#f2f22a'

export default makeScene2D(function* (view) {
	const logger = useLogger();

	view.fill(GRAY);

	let data = setup(view);
	data.logger = logger;

	data.codeRef = createRef<CodeBlock>();
	yield view.add(<CodeBlock ref={data.codeRef}
		language="tsx"
		code={`ray.dir = plane.normal;`}
		y={-740}
	/>);

	yield* run(data)

	yield* cleanup(data);
});

function setup(view) {
	const data = {};

	data.gridRef = createRef<Grid>();
	view.add(<Grid ref={data.gridRef}
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

	data.randomVectorRefs = createRef<Node>();
	view.add(<Node ref={data.randomVectorRefs} />)
	createRandomVectorRefs(data.randomVectorRefs);

	data.sunRayRef = createRef<Line>();
	view.add(<Line ref={data.sunRayRef}
		points={[[540, -115], [0, 200]]}
		stroke={YELLOW}
		lineWidth={10}
		lineCap={'round'}
		opacity={0}
		end={0}
	/>);

	data.normalRef = createRef<Line>();
	data.surfaceRef = createRef<Line>();
	data.surfaceGroup = createRef<Node>();
	view.add(
		<Node ref={data.surfaceGroup} y={200}>
			<Line ref={data.normalRef}
				points={[[0, 0], [0, -200]]}
				stroke={RED}
				lineWidth={10}
				endArrow
				end={0}
			/>
			<Line ref={data.surfaceRef}
				points={[[-400, 0], [400, 0]]}
				stroke={WHITE}
				lineWidth={20}
				lineCap={'round'}
				opacity={0}
			/>
		</Node>
	);

	data.sunRef = createRef<Node>();
	view.add(
		<Node ref={data.sunRef} x={600} y={-150} opacity={0}>
			<Circle
				fill={YELLOW}
				size={100}
			></Circle>
		</Node>
	)
	addSunshineRefs(data.sunRef);

	data.rectRef = createRef<Rect>();
	view.add(<Rect ref={data.rectRef}
		fill={GRAY}
		width={view.width}
		height={400}
		y={-840}
	/>);

	// TODO: REMOVE
	data.line = createRef<Line>();
	view.add(<Line ref={data.line} lineWidth={3} stroke="#ECEFF4" points={[[0, 0], [100, 200]]} />)

	return data;
}

function createRandomVectorRefs(randomVectorRefs) {
	const randomVectorCount = 10;
	const randomVectorAngleIncrement = 2 * Math.PI / randomVectorCount;
	let angle = 0;

	for (let i = 0; i < randomVectorCount; i++) {
		const randomVectorRef = createRef<Line>();

		angle += randomVectorAngleIncrement;

		randomVectorRefs().add(<Line ref={randomVectorRef}
			points={[
				[0, 0],
				[Math.cos(angle) * 200, Math.sin(angle) * -200]
			]}
			stroke={YELLOW}
			lineWidth={10}
			endArrow
			end={0}
			lineCap={'round'}
			opacity={0}
		/>);
	}
};

function addSunshineRefs(sunRef) {
	const sunshineCount = 10;
	const sunshineAngleIncrement = 2 * Math.PI / sunshineCount;
	let angle = 0.53;
	const sunshineRefs = [];
	for (let i = 0; i < sunshineCount; i++) {
		const sunshineRef = createRef<Line>();

		sunshineRefs.push(sunshineRef);

		angle += sunshineAngleIncrement;

		sunRef().add(<Line ref={sunshineRef}
			points={[
				[Math.cos(angle) * 70, Math.sin(angle) * -70],
				[Math.cos(angle) * 100, Math.sin(angle) * -100]
			]}
			stroke={YELLOW}
			lineWidth={10}
			lineCap={'round'}
		/>);
	}
}

function* run(data) {
	yield* data.gridRef().opacity(1, 1.5);
	yield* waitFor(0.6);
	yield* data.surfaceRef().opacity(1, 1.5);
	yield* waitFor(0.4);
	yield* data.normalRef().end(1, 1.5);
	yield* waitFor(0.6);
	yield* data.surfaceGroup().rotation(30, 1.5).to(0, 1.5);
	yield* waitFor(0.6);
	yield* all(
		data.sunRef().opacity(1, 1.5),
		data.sunRayRef().opacity(1, 1.5)
	);
	yield* waitFor(0.6);
	yield* all(
		data.sunRayRef().end(1, 1.5),
		delay(0.9, data.normalRef().stroke(YELLOW, 1.5)),
		delay(0.9, data.sunRayRef().start(1, 1.5)),
		delay(2.0, data.sunRayRef().opacity(0, 0.6)),
	);
	yield* waitFor(0.6);
	yield* all(
		data.rectRef().position.y(-540, 2),
		data.codeRef().position.y(-440, 2)
	);
	yield* waitFor(1.5);
	yield* data.codeRef().edit(1.2)`ray.dir = plane.normal${insert(' + random()')};`;
	yield* waitFor(0.6);
	for (const randomVectorRef of data.randomVectorRefs().children()) {
		yield randomVectorRef.opacity(1, 1.5);
		yield randomVectorRef.end(1, 1.5);
	}
	yield* waitFor(2);
	yield* data.codeRef().edit(1.2)`ray.dir = ${insert('normalize(')}plane.normal + random()${insert(')')};`;
	// yield* waitFor(0.6);
	// yield* codeRef().selection(lines(0, Infinity), 1);

	// TODO: Lerp data.randomVectorRefs to be normalized
	data.logger.debug("foo");

	// TODO: REMOVE
	// yield* data.line().points([[500, 200], [-200, -500]], 5, easeInOutCubic)

	// data.logger.debug(`${data.randomVectorRefs().children()[0]}`);
	yield* data.randomVectorRefs().children()[0].points([[0, 200], [100, 100]], 3);

	// yield* data.randomVectorRefs().children()[0].points([[0, 200], [100, 100]], 3, easeInOutCubic);
	// for (const randomVectorRef of data.randomVectorRefs().children()) {
	// 	// yield randomVectorRef.points()[1].x += 10;
	// 	// data.logger.debug(`${randomVectorRef.points()[1].x}`);

	// 	// const oldStartX = randomVectorRef.points()[0].x;
	// 	// const oldStartY = randomVectorRef.points()[0].y;
	// 	const oldEndX = randomVectorRef.points()[1].x;
	// 	const oldEndY = randomVectorRef.points()[1].y;

	// 	// const oldStartX = 100;
	// 	// const oldStartY = 100;
	// 	// const oldEndX = 100;
	// 	// const oldEndY = 100;

	// 	// yield* tween(2, value => {
	// 	// 	// randomVectorRef.points()[0].x = map(oldStartX, 0, value);
	// 	// 	// randomVectorRef.points()[0].y = map(oldStartY, 0, value);
	// 	// 	randomVectorRef.points()[1].x = map(oldEndX, 0, value);
	// 	// 	randomVectorRef.points()[1].y = map(oldEndY, 0, value);
	// 	// });

	// 	// yield randomVectorRef.points([[0, 200], [oldEndX, oldEndY]], 3, easeInOutCubic);
	// 	yield randomVectorRef.points([[0, 200], [100, 100]], 3, easeInOutCubic);
	// }
	data.logger.debug("bar");

	yield* waitFor(2);
}

function* cleanup(data) {
	for (const randomVectorRef of data.randomVectorRefs().children()) {
		yield randomVectorRef.opacity(0, 0.6);
		yield randomVectorRef.end(0, 0.6);
	}

	yield * all(
		data.rectRef().position.y(-840, 0.6),
		data.codeRef().position.y(-740, 0.6),
		delay(0.1, data.sunRef().opacity(0, 0.6)),
		delay(0.4, data.normalRef().end(0, 0.6)),
		delay(0.7, data.surfaceRef().opacity(0, 0.6)),
		delay(1.2, data.gridRef().opacity(0, 0.6))
	);
}
