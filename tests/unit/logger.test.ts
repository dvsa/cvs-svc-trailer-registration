import * as Logger from '../../src/utils/logger';

describe('Logger file', () => {
  describe('handleLogFunction', () => {
    it('should call the function with body args', () => {
      const cb = jest.fn();
      Logger.handleLogFunction({}, cb);
      expect(cb).toBeCalledTimes(1);
    });

    it('should call the callback function with body and params args when params are given', () => {
      const mockCb = jest.fn((a: string) => a);
      Logger.handleLogFunction({}, mockCb, 'foo');
      expect(mockCb).toBeCalledWith({}, 'foo');
    });
  });
});
