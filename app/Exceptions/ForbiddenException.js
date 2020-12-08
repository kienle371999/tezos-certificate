'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

class ForbiddenException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.forbidden({ error: error.message });
  }
}

module.exports = ForbiddenException;
