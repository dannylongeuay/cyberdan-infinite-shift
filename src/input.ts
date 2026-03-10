export type InputCallback = (x: number, y: number) => void;

export class Input {
  private callback: InputCallback | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas.addEventListener("click", this.handleClick);
    this.canvas.addEventListener("touchstart", this.handleTouch, { passive: false });
  }

  onInput(cb: InputCallback) {
    this.callback = cb;
  }

  private handleClick = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.callback?.(e.clientX - rect.left, e.clientY - rect.top);
  };

  private handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.callback?.(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  destroy() {
    this.canvas.removeEventListener("click", this.handleClick);
    this.canvas.removeEventListener("touchstart", this.handleTouch);
    this.callback = null;
  }
}
