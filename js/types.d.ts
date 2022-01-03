export interface CanvasHelperOptions {
  gridSize: number;
  upPenRadius: number;
  downPenRadius: number;
  lineWidth: number;
}

export interface AppOptions {
  canvasOptions?: Partial<CanvasHelperOptions>;
  root: HTMLElement;
  width: number;
  height: number;
}

export interface GridCanvasData {
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

type Command = string;

export type CommandDefinition = Record<
  Command,
  {
    allowArguments: boolean;
    defaultArgument?: string;
  }
>;

export interface CommandParserOptions {
  definitions: CommandDefinition;
}

export interface ParsedCommand {
  command: string;
  argument?: string;
}

export type ParsedCommandSeries = ParsedCommand[];
