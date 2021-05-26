import fs from 'fs-extra';
import tmp from 'tmp';
import files from '../files';

describe('Files', () => {
  beforeEach(() => {
    tmp.setGracefulCleanup();
  });

  afterAll(() => {
    tmp.setGracefulCleanup();
  });

  describe('readJSON', () => {
    it('should return a JSON from existing JSON files', () => {
      const tmpObj = tmp.fileSync();

      fs.writeFileSync(tmpObj.name, '{"field1": "value1", "field2": "value2"}');

      const result = files.readJSON(tmpObj.name) as any;

      expect(result.field1).toEqual('value1');
      expect(result.field2).toEqual('value2');
    });
  });
});
