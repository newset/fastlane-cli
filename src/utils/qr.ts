const qr = require("qrcode-terminal");
const os = require("os");
const ip = require("ip").address();

export const showLocal = (args: any) => {
  const url = new URL("/", "https://example.org/");

  url.hostname = ip;
  url.port = args.port || 80;
  url.protocol = "http:";

  console.log("url: ", url.href);
  qr.generate(url.href);
};
