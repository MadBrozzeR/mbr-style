declare module 'mbr-style' {
  interface StyleNode {
    [key: string]: StyleNode | string | number;
  }
  interface StyleRoot {
    [key: string]: StyleNode;
  }

  class Styles {
    target: HTMLStyleElement;
    styles: Record<string, StyleRoot>;
    isRenderQueued: boolean;

    static create(): Styles;
    static compile(styles: StyleRoot): string;

    constructor(target: HTMLStyleElement);

    render(): void;
    toString(): string;

    add(key: string, styles: StyleRoot): Styles;
    del(key: string): Styles;
  }
}
