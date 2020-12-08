'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

class UnauthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.unauthorized({ error: error.message });
  }
}

module.exports = UnauthorizedException;
