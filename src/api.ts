

export const git = "https://git.doctorwork.com/qiexr/public-group/templates";
// const ssh = "gitlab.aihaisi.com:qiexr/public-group/templates"
const ssh = "git@gitlab.aihaisi.com:qiexr/public-group"


const handleType: { [key: string]: string } = {
    create: 'templates',
    subpackage: 'subpackage'
}


export const getTemplateUrl = (name: string, handle: string) => {
    const type = handleType[handle]
    return `${ssh}/${type}/${name}.git`
};
