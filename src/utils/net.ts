const https = require("https");
import request, {
  RequestResponse,
  RequestOptionsInit,
  ResponseError,
} from "umi-request";
import { ServerResponse } from "http";

// interface R

const get = request.get;

const post = function (
  url: string,
  options: RequestOptionsInit
): Promise<RequestResponse> {
  return request
    .post(url, options)
    .then((res) => res.data)
    .catch((error: ResponseError) => {
      console.log("[Request Error]", error.message, error.data);
      return error;
    });
};

export { get, post, request };
