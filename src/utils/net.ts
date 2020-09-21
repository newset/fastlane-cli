const https = require("https");
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

export { get };
