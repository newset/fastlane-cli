const https = require("https");
import request from "umi-request";
import { ServerResponse } from "http";

const handle = (resolve: any) => {
  return (res: ServerResponse) => {
    const data: Uint8Array[] = [];
    res.on("data", (chunk: Uint8Array) => {
      data.push(chunk);
    });
    res.on("end", () => resolve(Buffer.concat(data).toString()));
  };
};

const get = (url: string): Promise<any> =>
  new Promise((resolve) => {
    https.get(url, handle(resolve));
  }).then(JSON.parse);

const post = (url: string, options: any): Promise<any> =>
  new Promise((resolve) => {
    https.post(url, handle(resolve));
  }).then(JSON.parse);

export { get, post, request };
