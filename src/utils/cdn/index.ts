/**
 * getAuth - 获取 cos token, 依赖环境变量 COS_TOKEN_URL
 */
import { get } from "../net";
const COS = require("cos-nodejs-sdk-v5");
import glob from "glob";
const path = require("path");

export const buckets = {
  default: process.env.DEFAULT_BUCKET,
};

function getCosSetting(args: any) {
  const region = args.region || "ap-shanghai";
  const [Bucket, Region = region] = args.bucket.split(":");

  return {
    Bucket,
    Region,
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

/**
 * 通过API获取临时token创建client
 */
export const createTempClient = () => {
  const cos = new COS({
    FileParallelLimit: 5,
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
 * 通过环境变量创建client
 */
export function createClient() {
  return new COS({
    FileParallelLimit: 5,
    SecretId: process.env.COS_SECRETID,
    SecretKey: process.env.COS_SECRETKEY,
  });
}

export class Client {
  private client: any;
  constructor(type = "temp", authUrl?: string) {
    if (type === "temp") {
      this.client = createTempClient();
    } else {
      this.client = createClient();
    }
    return this;
  }

  /**
   * 上传内容 - /结尾表示文件夹
   * prefix: /
   * ignore: 排除
   * @return files 文件列表
   */
  async upload(ctx: any): Promise<string[]> {
    if (!ctx.files) throw new Error("请指定上传文件");

    const cos = this.client;
    const files = glob.sync(ctx.files, {
      nodir: true,
      cwd: ctx.from,
    });

    if (!files.length) throw new Error("文件不存在");

    return new Promise((resolve, reject) => {
      cos.uploadFiles({
        files: files.map((file) => ({
          ...getCosSetting(ctx),
          Key: path.join(ctx.prefix, file),
          FilePath: path.join(ctx.from, file),
        })),
        onFileFinish: function (err: any, data: any, options: any) {
          if (err) {
            console.log(err, data);
            reject();
            return;
          }
          console.log("上传: ", options.Key);
        },
        onProgress(info: any) {
          if (info.percent == 1) {
            resolve(files);
          }
        },
      });
    });
  }

  async search(ctx: any) {
    const cos = this.client;
    cos.getBucket(
      {
        ...getCosSetting(ctx),
        Prefix: ctx.file,
      },
      console.log
    );
  }
}
