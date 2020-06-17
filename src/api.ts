export const types = [
    'weapp',
    'h5',
    'admin',
    'node',
    // 'full',
    // 'ssr'，
    // 'doc'，
]

export const git = "https://git.doctorwork.com/qiexr/public-group/templates";
const ssh = "gitlab.aihaisi.com:qiexr/public-group/templates"

export const templates = {
    'h5': "mobile-native",
    'weapp': "mobile-native",
    'admin': "umi-dash",
    'node': "nodejs",
}

export type ProjectType = typeof templates;

type TempType = keyof ProjectType;

export const getTemplateUrl = (type: number) => {
    const name = types[type] as TempType;
    // return `${git}/-/archive/master/${templates[name]}-master.zip`;
    return `${ssh}/${templates[name]}`
};