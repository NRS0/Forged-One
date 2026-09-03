import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * A pill whose surface is a live liquid-metal shader, with a black face inset
 * over it so the metal reads as a rim. Adapted from the paper-design demo:
 *
 * - sizes itself from its content instead of a fixed 142x46, since the
 *   Blacksmith launcher carries an icon and two lines of label;
 * - calls ShaderMount.dispose(), which is what v0.0.80 actually exposes. The
 *   demo called destroy(), which does not exist, so its cleanup never ran and
 *   each unmount leaked a WebGL context;
 * - holds still under prefers-reduced-motion and falls back to a plain black
 *   pill if WebGL is unavailable, so the button never depends on the effect.
 */

interface LiquidMetalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "dialog";
  "aria-controls"?: string;
}

const IDLE = 0.6;
const HOVER = 1;
const CLICK = 2.4;

export function LiquidMetalButton({
  children,
  onClick,
  className = "",
  style,
  ...aria
}: LiquidMetalButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderHost = useRef<HTMLDivElement>(null);
  const mount = useRef<ShaderMount | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const still = useRef(false);

  useEffect(() => {
    const host = shaderHost.current;
    if (!host) return;
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      mount.current = new ShaderMount(
        host,
        liquidMetalFragmentShader,
        {
          u_colorBack: [0, 0, 0, 1],
          u_colorTint: [1, 1, 1, 1],
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
          u_shape: 1,
          u_isImage: false,
        },
        undefined,
        still.current ? 0 : IDLE,
      );
    } catch (err) {
      /* No WebGL, or a context limit. The face underneath is a plain black
         pill, so the button still reads and still works. */
      console.warn("Liquid metal shader unavailable, using the flat button:", err);
      mount.current = null;
    }

    return () => {
      mount.current?.dispose();
      mount.current = null;
    };
  }, []);

  const speed = (v: number) => {
    if (!still.current) mount.current?.setSpeed(v);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    speed(CLICK);
    setTimeout(() => speed(hovered ? HOVER : IDLE), 300);

    if (button.current) {
      const rect = button.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
    }
    onClick?.();
  };

  const lift = pressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)";
  const ease = "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <div className={`relative inline-block ${className}`} style={{ perspective: "1000px", ...style }}>
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        {/* metal rim: the shader fills this, the face sits 2px inside it */}
        <div
          className="rounded-full"
          style={{
            transform: `translateZ(0) ${lift}`,
            transition: ease,
            boxShadow: pressed
              ? "0 0 0 1px rgba(0,0,0,.5), 0 1px 2px rgba(0,0,0,.3)"
              : hovered
                ? "0 0 0 1px rgba(0,0,0,.4), 0 12px 6px rgba(0,0,0,.05), 0 8px 5px rgba(0,0,0,.1), 0 4px 4px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.2)"
                : "0 0 0 1px rgba(0,0,0,.3), 0 36px 14px rgba(0,0,0,.02), 0 20px 12px rgba(0,0,0,.08), 0 9px 9px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.15)",
          }}
        >
          <div
            ref={shaderHost}
            className="liquid-metal-host absolute inset-0 overflow-hidden rounded-full bg-[#2a2a2a]"
            aria-hidden="true"
          />
          <div
            className="relative m-[2px] rounded-full"
            style={{
              background: "linear-gradient(180deg, #202020 0%, #000 100%)",
              boxShadow: pressed ? "inset 0 2px 4px rgba(0,0,0,.4), inset 0 1px 2px rgba(0,0,0,.3)" : "none",
              transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* the face, lifted above the rim in 3D so it reads as raised */}
            <div
              className="pointer-events-none flex items-center gap-2.5 py-2 pl-2 pr-5"
              style={{ transform: "translateZ(20px)" }}
            >
              {children}
            </div>
          </div>
        </div>

        <button
          ref={button}
          type="button"
          onClick={handleClick}
          onMouseEnter={() => { setHovered(true); speed(HOVER); }}
          onMouseLeave={() => { setHovered(false); setPressed(false); speed(IDLE); }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          className="absolute inset-0 cursor-pointer overflow-hidden rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          style={{ transform: "translateZ(25px)" }}
          {...aria}
        >
          {ripples.map((r) => (
            <span
              key={r.id}
              className="liquid-metal-ripple pointer-events-none absolute h-5 w-5 rounded-full"
              style={{
                left: r.x,
                top: r.y,
                background: "radial-gradient(circle, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 70%)",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
