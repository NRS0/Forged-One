import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Lenis from 'lenis';
import Root from './Root.tsx';
import './index.css';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root path={window.location.pathname} />
  </StrictMode>,
);
