import {asClass, createContainer} from "awilix";

import * as controllers from "./controllers";

export const container = createContainer().register({
  HelloController: asClass(controllers.HelloController),
});
