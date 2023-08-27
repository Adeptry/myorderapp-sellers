import pino, { Logger } from "pino";

interface LogObject {
  time: number;
  level: number;
  msg: string;
  [key: string]: any;
}

export const logger: Logger = pino({
  browser: {
    asObject: true,
    write: {
      info: (o) => console.log((o as LogObject).msg, o),
      error: (o) => console.error((o as LogObject).msg, o),
      debug: (o) => console.debug((o as LogObject).msg, o),
      warn: (o) => console.warn((o as LogObject).msg, o),
    },
  },
});
