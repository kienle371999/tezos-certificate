'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

class InternalException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    response.internal({ error: error.message });
  }
}

module.exports = InternalException;
