import * as oddlog from "oddlog";

export const logger = oddlog.createLogger("api", {
  transports: [{type: "stream"}],
});
