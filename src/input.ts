export type InputCallback = (x: number, y: number) => void;
export type ReleaseCallback = () => void;

export class Input {
  private pressCallback: InputCallback | null = null;
  private moveCallback: InputCallback | null = null;
  private releaseCallback: ReleaseCallback | null = null;
  private pointerDown = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerUp);
    this.canvas.addEventListener("pointerleave", this.handlePointerUp);
  }

  onPress(cb: InputCallback) {
    this.pressCallback = cb;
  }

  onMove(cb: InputCallback) {
    this.moveCallback = cb;
  }

  onRelease(cb: ReleaseCallback) {
    this.releaseCallback = cb;
  }

  private toCanvasCoords(e: PointerEvent): [number, number] {
    const rect = this.canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  private handlePointerDown = (e: PointerEvent) => {
    this.pointerDown = true;
    this.canvas.setPointerCapture(e.pointerId);
    const [x, y] = this.toCanvasCoords(e);
    this.pressCallback?.(x, y);
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.pointerDown) return;
    const [x, y] = this.toCanvasCoords(e);
    this.moveCallback?.(x, y);
  };

  private handlePointerUp = (_e: PointerEvent) => {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    this.releaseCallback?.();
  };

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerUp);
    this.pressCallback = null;
    this.moveCallback = null;
    this.releaseCallback = null;
  }
}
