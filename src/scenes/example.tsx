import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Grid, Rect, Line, Node, Circle } from '@motion-canvas/2d/lib/components';
import { createRef, useLogger, useRandom } from '@motion-canvas/core/lib/utils';
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { CodeBlock, insert, word } from '@motion-canvas/2d/lib/components/CodeBlock';
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { Vector2 } from '@motion-canvas/core/lib/types';

enum RandomVectorType {
	randomVector,
	randomUnitVector,
}
// This is configurable!
const CHOSEN_UNIT_VECTOR_TYPE = RandomVectorType.randomVector;

const GRAY = '#2a2a2a';
const LIGHT_GRAY = '#444444';
const WHITE = '#f2f2f2';
const RED = '#f22a2a';
const YELLOW = '#f2f22a';

const CELL_SIZE = 200;

export default makeScene2D(function* (view) {
	view.fill(GRAY);

	const data = {};
	data.logger = useLogger();
	data.random = useRandom();

	setup(view, data);

	data.codeRef = createRef<CodeBlock>();
	yield view.add(<CodeBlock ref={data.codeRef}
		language="tsx"
		code={`ray.dir = plane.normal;`}
		y={-740}
	/>);

	yield* run(data)

	yield* cleanup(data);
});

function setup(view, data) {
	data.gridRef = createRef<Grid>();
	view.add(<Grid ref={data.gridRef}
		width={view.width}
		height={view.height}
		spacing={CELL_SIZE}
		stroke={LIGHT_GRAY}
		lineWidth={4}
		opacity={0}
		lineDash={[15]}
	/>);

	data.randomVectorRefs = createRef<Node>();
	view.add(<Node ref={data.randomVectorRefs} />)
	createRandomVectorRefs(data);

	data.sunRayRef = createRef<Line>();
	view.add(<Line ref={data.sunRayRef}
		points={[[540, -115], [0, CELL_SIZE]]}
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
		<Node ref={data.surfaceGroup} y={CELL_SIZE}>
			<Line ref={data.normalRef}
				points={[[0, 0], [0, -CELL_SIZE]]}
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
}

function createRandomVectorRefs(data) {
	const randomVectorRefs = data.randomVectorRefs;
	const randomVectorCount = 50;
	const randomVectorAngleIncrement = 2 * Math.PI / randomVectorCount;
	let angle = 0;

	for (let i = 0; i < randomVectorCount; i++) {
		const randomVectorRef = createRef<Line>();

		let x, y;

		if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomUnitVector)
		{
			const radians = data.random.nextFloat() * 2 * Math.PI;
			x = Math.cos(radians);
			y = Math.sin(radians);
		}
		else if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomVector)
		{
			const radians = data.random.nextFloat() * 2 * Math.PI;
			x = Math.cos(radians) * data.random.nextFloat();
			y = Math.sin(radians) * data.random.nextFloat();
		}

		// x = Math.cos(angle);
		// y = Math.sin(angle);

		// x = Math.cos(angle) * data.random.nextFloat();
		// y = Math.sin(angle) * data.random.nextFloat();

		// x = Math.cos(data.random.nextFloat() * 2 * Math.PI) * data.random.nextFloat();
		// y = Math.sin(data.random.nextFloat() * 2 * Math.PI) * data.random.nextFloat();

		// TODO: DON'T PASS LOGGER
		// const unitVector = randomUnitVector(data.random, data.logger);
		// data.logger.debug(`${unitVector.x * unitVector.x + unitVector.y * unitVector.y}`);
		// x = unitVector.x;
		// y = unitVector.y;

		randomVectorRefs().add(<Line ref={randomVectorRef}
			points={[
				[0, 0],
				[x * CELL_SIZE, y * -CELL_SIZE]
			]}
			stroke={YELLOW}
			lineWidth={10}
			endArrow
			// arrowSize={8}
			end={0}
			lineCap={'round'}
			opacity={0}
		/>);

		angle += randomVectorAngleIncrement;
	}
}

// Source:
// https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
function randomUnitVector(random, logger)
{
    const z = random.nextFloat() * 2 - 1;
    const a = random.nextFloat() * 2 * Math.PI;
    const r = Math.sqrt(1 - z * z);
    const x = r * Math.cos(a);
	const y = r * Math.sin(a);
	// TODO: Does this function even make sense if we're not returning the z variable?
	// Not returning the z variable causes it to not be a unit vector anymore!
	logger.debug(`${x * x + y * y + z * z}`);
	return new Vector2(x, y);
}

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
	yield* waitFor(1);

	let randomVectorName;
	if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomUnitVector) {
		randomVectorName = 'randomUnitVector';
	} else if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomVector) {
		randomVectorName = 'randomVector';
	}

	yield* data.codeRef().edit(3)`ray.dir = plane.normal${insert(' + ' + randomVectorName + '()')};`;
	yield* waitFor(0.6);
	for (const randomVectorRef of data.randomVectorRefs().children()) {
		yield randomVectorRef.opacity(0.3, 1.5);
		yield randomVectorRef.end(1, 1.5);
	}
	yield* waitFor(2);

	if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomUnitVector) {
		yield data.codeRef().selection(word(0, 10, 33), 1);
	} else if (CHOSEN_UNIT_VECTOR_TYPE === RandomVectorType.randomVector) {
		yield data.codeRef().selection(word(0, 10, 29), 1);
	}

	yield* data.normalRef().opacity(0, 2);
	for (const randomVectorRef of data.randomVectorRefs().children()) {
		const oldEndX = randomVectorRef.points()[1][0];
		const oldEndY = randomVectorRef.points()[1][1];

		yield randomVectorRef.points([[0, CELL_SIZE], [oldEndX, oldEndY]], 2, easeInOutCubic);
	}
	yield* waitFor(3);
	yield* data.codeRef().edit(3)`ray.dir = ${insert('normalize(')}plane.normal + ${randomVectorName}()${insert(')')};`;

	for (const randomVectorRef of data.randomVectorRefs().children()) {
		const newEndX = randomVectorRef.points()[1][0] - randomVectorRef.points()[0][0];
		const newEndY = randomVectorRef.points()[1][1] - randomVectorRef.points()[0][1];

		const normalized = new Vector2(newEndX, newEndY).normalized.mul(CELL_SIZE);

		yield randomVectorRef.points([[0, CELL_SIZE], [normalized.x * 1, normalized.y * 1 + CELL_SIZE]], 2, easeInOutCubic);
	}
	yield* waitFor(5);
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
		delay(0.2, data.surfaceRef().opacity(0, 0.6)),
		delay(0.5, data.gridRef().opacity(0, 0.6))
	);
}
