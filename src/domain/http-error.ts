/**
 * Defines a throwable subclass of Error used for signaling an HTTP status code.
 */
export class HTTPError extends Error {
  public statusCode: number;

  public body: unknown;

  /**
   * Constructor for the HTTPResponseError class
   * @param statusCode the HTTP status code
   * @param body - the response body
   * @param headers - optional - the response headers
   */
  constructor(statusCode: number, body: unknown) {
    super();
    this.statusCode = statusCode;
    this.body = body;
  }
}
