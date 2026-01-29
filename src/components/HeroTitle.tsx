import React from 'react';

interface HeroTitleProps {
  text: string;
  speedMs?: number;
  className?: string;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ text, speedMs = 35, className }) => {
  const [count, setCount] = React.useState(0);
  const [caretOn, setCaretOn] = React.useState(true);

  React.useEffect(() => {
    let raf = 0 as number | undefined;
    let last = performance.now();
    let acc = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      while (acc >= speedMs && count < text.length) {
        setCount((c) => Math.min(c + 1, text.length));
        acc -= speedMs;
      }
      if (count < text.length) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
    // We intentionally exclude dependencies to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setCaretOn((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  const visible = text.slice(0, count);

  return (
    <h1 className={className} aria-label={text}>
      <span>{visible}</span>
      <span
        style={{
          display: 'inline-block',
          width: '0.6ch',
          height: '1em',
          marginLeft: '0.15ch',
          verticalAlign: 'middle',
          background: 'currentColor',
          opacity: caretOn ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </h1>
  );
};

export default HeroTitle;
