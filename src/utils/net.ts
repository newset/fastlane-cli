const https = require("https");
import request, {
  RequestResponse,
  RequestOptionsInit,
  ResponseError,
} from "umi-request";
import { ServerResponse } from "http";

// interface R

const handle = (resolve: any) => {
  return (res: ServerResponse) => {
    const data: Uint8Array[] = [];
    res.on("data", (chunk: Uint8Array) => {
      data.push(chunk);
    });
    res.on("end", () => resolve(Buffer.concat(data).toString()));
  };
};

const get = request.get;

const post = function (
  url: string,
  options: RequestOptionsInit
): Promise<RequestResponse> {
  return request.post(url, options).catch((error: ResponseError) => {
    console.log("[Request Error]", error.message, error.data);
    return error;
  });
};

export { get, post, request };
