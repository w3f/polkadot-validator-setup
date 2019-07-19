const fs = require('fs-extra');
const tmp = require('tmp');

const subject = require('../../src/lib/files')

require('chai').should()


describe('Files', () => {
  before(() => {
    tmp.setGracefulCleanup();
  });

  describe('readJSON', () => {
    it('should return a JSON from existing JSON files', () => {
      const tmpobj = tmp.fileSync();

      fs.writeFileSync(tmpobj.name, '{"field1": "value1", "field2": "value2"}');

      const result = subject.readJSON(tmpobj.name);

      result['field1'].should.equal('value1');
      result['field2'].should.equal('value2');
    });
  });
});
