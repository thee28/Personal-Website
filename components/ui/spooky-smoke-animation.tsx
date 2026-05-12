"use client";

import { useEffect, useRef } from "react";

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform float u_opacity;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time + 660.0)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.0),u.x),u.y);}
float fbm(vec2 p){float t=0.0,a=1.0;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1.0,-1.2,0.2,1.2)*2.0;a*=0.5;}return t;}

void main(){
  vec2 uv=(FC-0.5*R)/R.y;
  uv.x+=0.25;
  uv*=vec2(2.0,1.0);

  float n=fbm(uv*0.28-vec2(T*0.01,0.0));
  n=noise(uv*3.0+n*2.0);

  float r=fbm(uv+vec2(0.0,T*0.015)+n);
  float g=fbm(uv*1.003+vec2(0.0,T*0.015)+n+0.003);
  float b=fbm(uv*1.006+vec2(0.0,T*0.015)+n+0.006);

  float smoke=1.0-dot(vec3(r,g,b),vec3(0.21,0.71,0.07));
  smoke=smoothstep(0.12,0.86,smoke);
  float volume=pow(smoke,0.72);

  float vignette=1.0-smoothstep(1.35,2.05,length(uv*vec2(0.65,1.05)));
  float alpha=clamp(volume*1.25,0.0,1.0)*vignette*u_opacity;
  vec3 color=mix(u_color*0.78,min(u_color*1.15,vec3(1.0)),volume);

  O=vec4(color,alpha);
}`;

type ProgramUniforms = WebGLProgram & {
  resolution?: WebGLUniformLocation | null;
  time?: WebGLUniformLocation | null;
  u_color?: WebGLUniformLocation | null;
  u_opacity?: WebGLUniformLocation | null;
};

class Renderer {
  private readonly vertexSrc =
    "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext | null;
  private canvas: HTMLCanvasElement;
  private program: ProgramUniforms | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.72, 0.72, 0.72];
  private opacity = 0.32;

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!this.gl) {
      return;
    }

    this.setup(fragmentSource);
    this.init();
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateOpacity(newOpacity: number) {
    this.opacity = newOpacity;
  }

  updateScale() {
    if (!this.gl) {
      return;
    }

    const dpr = Math.max(1, window.devicePixelRatio);
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    if (!this.gl) {
      return;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    if (!this.gl) {
      return;
    }

    const { gl, program, vs, fs, buffer } = this;

    if (!program) {
      return;
    }

    if (buffer) {
      gl.deleteBuffer(buffer);
    }

    if (vs) {
      gl.detachShader(program, vs);
      gl.deleteShader(vs);
    }

    if (fs) {
      gl.detachShader(program, fs);
      gl.deleteShader(fs);
    }

    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    if (!this.gl) {
      return;
    }

    this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    const program = this.gl.createProgram();

    if (!this.vs || !this.fs || !program) {
      return;
    }

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);

    this.program = program as ProgramUniforms;
    this.gl.attachShader(this.program, this.vs);
    this.gl.attachShader(this.program, this.fs);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(`Program linking error: ${this.gl.getProgramInfoLog(this.program)}`);
    }
  }

  private init() {
    if (!this.gl || !this.program) {
      return;
    }

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

    const position = this.gl.getAttribLocation(this.program, "position");
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.program.resolution = this.gl.getUniformLocation(this.program, "resolution");
    this.program.time = this.gl.getUniformLocation(this.program, "time");
    this.program.u_color = this.gl.getUniformLocation(this.program, "u_color");
    this.program.u_opacity = this.gl.getUniformLocation(this.program, "u_opacity");
  }

  render(now = 0) {
    if (!this.gl || !this.program || !this.gl.isProgram(this.program)) {
      return;
    }

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    if (this.program.resolution) {
      this.gl.uniform2f(this.program.resolution, this.canvas.width, this.canvas.height);
    }

    if (this.program.time) {
      this.gl.uniform1f(this.program.time, now * 1e-3);
    }

    if (this.program.u_color) {
      this.gl.uniform3fv(this.program.u_color, this.color);
    }

    if (this.program.u_opacity) {
      this.gl.uniform1f(this.program.u_opacity, this.opacity);
    }

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());

  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null;
}

type SmokeBackgroundProps = {
  className?: string;
  darkColor?: string;
  lightColor?: string;
  opacity?: number;
  darkOpacity?: number;
  lightOpacity?: number;
};

function getThemeSmokeSettings(
  lightColor: string,
  darkColor: string,
  lightOpacity: number | undefined,
  darkOpacity: number | undefined,
  defaultOpacity: number,
) {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  return {
    color: isLight ? lightColor : darkColor,
    opacity: isLight ? (lightOpacity ?? defaultOpacity) : (darkOpacity ?? defaultOpacity),
  };
}

export function SmokeBackground({
  className,
  darkColor = "#c4c4c4",
  lightColor = "#3f3f46",
  opacity = 0.34,
  darkOpacity,
  lightOpacity,
}: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const renderer = new Renderer(canvasRef.current, fragmentShaderSource);
    rendererRef.current = renderer;

    const handleResize = () => renderer.updateScale();
    handleResize();
    window.addEventListener("resize", handleResize);

    let animationFrameId = 0;
    const loop = (now: number) => {
      renderer.render(now);
      animationFrameId = window.requestAnimationFrame(loop);
    };
    animationFrameId = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
      renderer.reset();
    };
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const renderer = rendererRef.current;
      if (!renderer) {
        return;
      }

      const settings = getThemeSmokeSettings(
        lightColor,
        darkColor,
        lightOpacity,
        darkOpacity,
        opacity,
      );
      const rgbColor = hexToRgb(settings.color);
      if (rgbColor) {
        renderer.updateColor(rgbColor);
      }

      renderer.updateOpacity(settings.opacity);
    };

    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [darkColor, lightColor, opacity, darkOpacity, lightOpacity]);

  return <canvas ref={canvasRef} className={className ?? "block h-full w-full"} />;
}
