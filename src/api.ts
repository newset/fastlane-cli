export const types = ["hybrid", "admin", "nodejs"];

export const git = "https://git.doctorwork.com/qiexr/public-group";
const ssh = "gitlab.aihaisi.com:qiexr/public-group";

interface ProjectMap {
  [key: string]: string | number;
}

const handleMap: ProjectMap = {
  create: "templates",
  subpackage: "subpackage",
};

export type TemplateType = "create" | "subpackage";

export const getTemplateUrl = (type: number | string, handle: TemplateType) => {
  // create的老用法 0 1 2有映射，其他用string直接取名字
  const name: string = typeof type === "number" ? types[type] : type;
  const subpath = handleMap[handle];

  return [`${ssh}/${subpath}/${name}.git`, name];
};
