import ejs from 'ejs';
import path from 'path';

function compile() {
  return ejs.renderFile(
    path.join(__dirname, '../.glz/package/src/{{name2}}.ts.ejs'),
    {
      name2: 'test-name',
    },
    {},
  );
}

export default compile;
