const fs = require('fs-extra');
const tmp = require('tmp');

const subject = require('../../src/lib/tpl')

require('chai').should()


describe('Tpl', () => {
  before(() => {
    tmp.setGracefulCleanup();
  });

  describe('create', () => {
    it('should create templated files', () => {
      const origin = tmp.fileSync();
      const value= 'a=b';
      fs.writeFileSync(origin.name, 'value is {{{ value }}}');

      const target = tmp.fileSync();

      const data = { value };

      subject.create(origin.name, target.name, data);

      const actual = fs.readFileSync(target.name).toString();
      const expected = 'value is a=b';

      actual.should.eq(expected);
    });
  });
});
