'use strict';

const ForbiddenException = use('App/Exceptions/ForbiddenException');
const BadRequestException = use('App/Exceptions/BadRequestException');
const NotFoundException = use('App/Exceptions/NotFoundException');
const InternalException = use('App/Exceptions/InternalException');
const UnauthorizedException = use('App/Exceptions/UnauthorizedException');

class ErrorFactory {
  static badRequest(message) {
    throw new BadRequestException(message);
  }

  static forbidden(message) {
    throw new ForbiddenException(message);
  }

  static notFound(message) {
    throw new NotFoundException(message);
  }

  static internal(message) {
    throw new InternalException(message);
  }

  static unauthorized(message) {
    throw new UnauthorizedException(message);
  }
}

module.exports = ErrorFactory;
