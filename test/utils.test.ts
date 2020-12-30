const { limit } = require("../lib/utils");
const test = require("ava");

function chunk(arr, n) {
  return arr.slice(0, ((arr.length + n - 1) / n) | 0).map(function (c, i) {
    return arr.slice(n * i, n * i + n);
  });
}

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

test("tool 命令解析", async (t) => {
  const start = new Date().getTime();
  const timers = [1, 2, 3, 4, 5].map((i) => {
    return async () => {
      await delay(1000);
      const diff = new Date().getTime() - start;
      return diff;
    };
  });

  const times = await limit(timers, 3);
  t.pass();
});
