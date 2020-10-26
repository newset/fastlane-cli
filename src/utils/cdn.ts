/**
 * getAuth - 获取 cos token, 依赖环境变量 COS_TOKEN_URL
 */
import { get } from "./net";
const COS = require("cos-nodejs-sdk-v5");
import glob from "glob";
const path = require("path");

function getCosSetting(args: any) {
  return {
    Bucket: args.bucket,
    Region: args.region || "ap-shanghai",
  };
}

export const getAuth = async (shell = true) => {
  const url = process.env.COS_TOKEN_URL;
  const { data } = await get(url);
  const envs = `SecretId=${data.tmpSecretId}\nSecretKey=${data.tmpSecretKey}`;
  if (shell) {
    console.log(envs);
  }
  return data;
};

const createClient = () => {
  const cos = new COS({
    getAuthorization: async (_: any, callback: any) => {
      const data = await getAuth(false);
      callback({
        TmpSecretId: data.tmpSecretId, // 临时密钥的 tmpSecretId
        TmpSecretKey: data.tmpSecretKey, // 临时密钥的 tmpSecretKey
        XCosSecurityToken: data.sessionToken,
        ExpiredTime: data.expiration,
      });
    },
  });
  return cos;
};

/**
 * 上传内容 - /结尾表示文件夹
 * prefix: /
 * ignore: 排除
 */
export const upload = async (ctx: any) => {
  if (!ctx.from) throw new Error("请指定上传文件");

  const cos = createClient();

  const files = glob.sync(ctx.from, {
    nodir: true,
  });

  if (!files.length) throw new Error("文件不存在");

  cos.uploadFiles({
    files: files.map((file) => ({
      ...getCosSetting(ctx),
      FilePath: file,
    })),
    onFileFinish: function (err: any, data: any, options: any) {
      if (err) {
        console.log(err, data);
        return;
      }

      console.log("上传: ", options.Key, "https://" + data.Location);
    },
  });
};

export const search = async (ctx: any) => {
  const cos = createClient();
  cos.getBucket(
    {
      ...getCosSetting(ctx),
      Prefix: ctx.file,
    },
    console.log
  );
};
