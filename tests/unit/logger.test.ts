/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '../../src/utils/logger';

describe('logger', () => {
  // beforeEach(() => {
  //   Configurations = new DataAccess();
  // });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('debug', () => {
    test('should return true when log level is debug', () => {
      const logger = new Logger('DEBUG');
      const result = logger.debug('debug is called');

      expect(result).toBe(true);
    });

    test('should return true when log level is less than debug', () => {
      const logger = new Logger('TRACE');

      const result = logger.debug('debug is called');

      expect(result).toBe(true);
    });

    test('should return false when log level is greater than debug', () => {
      const logger = new Logger('INFO');

      const result = logger.debug('debug is called');

      expect(result).toBe(false);
    });
  });

  describe('trace', () => {
    test('should return true when log level is trace', () => {
      const logger = new Logger('TRACE');
      const result = logger.trace('trace is called');

      expect(result).toBe(true);
    });

    test('should return false when log level is greater than trace', () => {
      const logger = new Logger('DEBUG');

      const result = logger.trace('trace is called');

      expect(result).toBe(false);
    });
  });

  describe('info', () => {
    test('should return true when log level is info', () => {
      const logger = new Logger('INFO');
      const result = logger.info('info is called');

      expect(result).toBe(true);
    });

    test('should return true when log level is less than info', () => {
      const logger = new Logger('DEBUG');

      const result = logger.info('info is called');

      expect(result).toBe(true);
    });

    test('should return false when log level is greater than debug', () => {
      const logger = new Logger('WARN');

      const result = logger.info('debug is called');

      expect(result).toBe(false);
    });
  });

  describe('warn', () => {
    test('should return true when log level is warn', () => {
      const logger = new Logger('WARN');
      const result = logger.warn('warn is called');

      expect(result).toBe(true);
    });

    test('should return true when log level is less than warn', () => {
      const logger = new Logger('TRACE');

      const result = logger.warn('warn is called');

      expect(result).toBe(true);
    });

    test('should return false when log level is greater than debug', () => {
      const logger = new Logger('ERROR');

      const result = logger.warn('warn is called');

      expect(result).toBe(false);
    });
  });

  describe('error', () => {
    test('should return true when log level is error', () => {
      const logger = new Logger('ERROR');
      const result = logger.error('error is called');

      expect(result).toBe(true);
    });

    test('should return true when log level is less than error', () => {
      const logger = new Logger('WARN');

      const result = logger.error('error is called');

      expect(result).toBe(true);
    });
  });
});
