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
    this.callback?.(e.clientX, e.clientY);
  };

  private handleTouch = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    this.callback?.(touch.clientX, touch.clientY);
  };
}
