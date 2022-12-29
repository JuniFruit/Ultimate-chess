export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas.getBoundingClientRect()
  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window
    const context = canvas.getContext('2d')
    canvas.width = width * ratio
    canvas.height = height * ratio
      context!.scale(ratio, ratio)
    return canvas
  }

  return null
}

interface IDrawCircleArg {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export const drawCircle = ({ ctx, x, y, radius, stroke, strokeWidth = .2, fill }: IDrawCircleArg) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}

interface IDrawRectArg extends Pick<IDrawCircleArg, "x" | "y" | "fill" | "stroke" | "strokeWidth" | "ctx"> {
  width: number;
  height: number;
}

export const drawRect = ({ ctx, x, y, fill, stroke, strokeWidth = 0, width, height }: IDrawRectArg) => {
  
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(x, y, width, height)
  }
  // if (stroke) {
  //   ctx.lineWidth = strokeWidth
  //   ctx.strokeStyle = stroke
  //   ctx.strokeRect(x, y, width, height)
  // }
} 