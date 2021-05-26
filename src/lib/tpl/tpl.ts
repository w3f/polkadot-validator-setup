import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';

Handlebars.registerHelper('raw', (options) => {
  return options.fn(undefined, undefined);
});

const tpl = {
  create: (source: string, target: string, data: any) => {
    const sourceTpl = fs.readFileSync(source).toString();
    const template = Handlebars.compile(sourceTpl);
    const contents = template(data);

    const targetDir = path.dirname(target);
    fs.mkdirSync(targetDir, { recursive: true });

    fs.writeFileSync(target, contents);
  },
};

export default tpl;
