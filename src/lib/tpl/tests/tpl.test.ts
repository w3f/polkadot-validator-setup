import fs from 'fs-extra';
import tmp from 'tmp';
import tpl from '../tpl';

describe('Tpl', () => {
  beforeAll(() => {
    tmp.setGracefulCleanup();
  });

  afterEach(() => {
    tmp.setGracefulCleanup();
  });

  describe('create', () => {
    it('should create templated files', () => {
      const origin = tmp.fileSync();
      const value = 'a=b';
      fs.writeFileSync(origin.name, 'value is {{{ value }}}');
      const target = tmp.fileSync();
      const data = { value };

      tpl.create(origin.name, target.name, data);

      const actual = fs.readFileSync(target.name).toString();
      const expected = 'value is a=b';

      expect(actual).toEqual(expected);
    });
  });
});
