export const types = [
  "hybrid",
  "admin",
  "nodejs",
  // 'full',
  // 'ssr'，
  // 'doc'，
];

export const git = "https://git.doctorwork.com/qiexr/public-group";
const ssh = "gitlab.aihaisi.com:qiexr/public-group";

interface ProjectMap {
  [key: string]: string;
}

const handleMap: ProjectMap = {
  create: "templates",
  subpackage: "subpackage",
};

export const templates: ProjectMap = {
  hybrid: "hybrid",
  admin: "admin",
  nodejs: "nodejs",
};

export type ProjectType = typeof templates;

type TempType = keyof ProjectType;

export const getTemplateUrl = (type: number | string, handle: string) => {
  // 取项目name待优化
  const key: string = typeof type === "number" ? types[type] : type;
  const name: string = handle === "create" ? templates[key] : key;
  const subpath = handleMap[handle];

  return `${ssh}/${subpath}/${name}.git`;
};
