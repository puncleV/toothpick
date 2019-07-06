import chai from "chai";
import chaiHttp from "chai-http";
import sinonChai from "sinon-chai";
import {server} from "../src/api";
import {cleanUpDatabase} from "./test-utils";

chai.use(chaiHttp);
chai.use(sinonChai);

afterEach(async () => {
  await cleanUpDatabase();
});

after(async () => {
  const runningServer = await server;

  await new Promise((resolve) => {
    runningServer.close(resolve);
  });
});
