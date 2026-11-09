/** Travel is driven by the lesson clock so pause, scrubbing and reduced motion share one state. */
export default function FlowParticles({from, to, time, color, strength = 1, count = 6, radius = 3, speed = .55}: {
  from: readonly [number, number];
  to: readonly [number, number];
  time: number;
  color: string;
  strength?: number;
  count?: number;
  radius?: number;
  speed?: number;
}) {
  return <g aria-hidden="true" pointerEvents="none">
    {Array.from({length: count}, (_, i) => {
      const progress = (time * speed + i / count) % 1;
      const opacity = Math.max(0, Math.min(1, strength * count - i));
      return <circle key={i} cx={from[0] + (to[0] - from[0]) * progress} cy={from[1] + (to[1] - from[1]) * progress} r={radius} fill={color} opacity={opacity}/>;
    })}
  </g>;
}
