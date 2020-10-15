/**
 * getAuth - 获取 cos token, 依赖环境变量 COS_TOKEN_URL
 */
import { get } from "./net";

export const getAuth = async () => {
  const url = process.env.COS_TOKEN_URL;
  const { data } = await get(url);
  console.log(`SecretId=${data.tmpSecretId}\nSecretKey=${data.tmpSecretKey}`);
  return data;
};

/**
 * 上传内容 - /结尾表示文件夹
 * prefix: /
 * ignore: 排除
 */
export const upload = async (ctx: any) => {
  const bucket = "public";
};
