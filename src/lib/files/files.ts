import fs from 'fs-extra';

const files = {
  readJSON: (filePath: string): any => {
    const rawContent = fs.readFileSync(filePath);

    return JSON.parse(rawContent.toString());
  },
};

export default files;
