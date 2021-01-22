const https = require("https");
import request, {
  RequestResponse,
  RequestOptionsInit,
  ResponseError,
} from "umi-request";

const get = request.get;

const post = function (
  url: string,
  options: RequestOptionsInit
): Promise<RequestResponse> {
  return request.post(url, options).catch((error: ResponseError) => {
    console.log("[Request Error]", error.message, error.data);
    return Promise.reject();
  });
};

export { get, post, request };
