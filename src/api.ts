export const types = [
  "hybrid",
  "admin",
  "node",
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
  hybrid: "mobile-native",
  admin: "umi-dash",
  node: "nodejs",
};

export type ProjectType = typeof templates;

type TempType = keyof ProjectType;

export const getTemplateUrl = (type: number | string, handle: string) => {
  const name: string = typeof type === "number" ? types[type] : type;
  const subpath = handleMap[handle];

  return `${ssh}/${subpath}/${name}.git`;
};
