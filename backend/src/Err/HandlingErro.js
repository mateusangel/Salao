class HandlingErro extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.message = msg;
    this.statusCode = statusCode;
    this.name = "CustomError";
  }
}

module.exports = HandlingErro;
