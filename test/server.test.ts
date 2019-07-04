import {expect, request} from "chai";
import {server} from "../src/api";

describe("server", () => {
  it("Responds to a request", async () => {
    const response = await request(server).get("/hello");

    expect(response).to.have.status(200);
    expect(response.text).to.eq("hello world");
  });
});
