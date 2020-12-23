export const Unauthorized = (reason?) => {
    return {
        success: false,
        code: 401,
        data: {
            error: reason || "Unauthorized"
        }
    }
}

export const BadRequest = (reason?) => {
    return {
        success: false,
        code: 400,
        data: {
            error: reason || "Bad Request"
        }
    }
}

export const NotFound = (reason?) => {
    return {
        success: false,
        code: 404,
        data: {
            error: reason || "Not Found"
        }
    }
}

export const Forbidden = (reason?) => {
    return {
        success: false,
        code: 403,
        data: {
            error: reason || "Forbidden"
        }
    }
}

export const ServerError = (reason?) => {
    return {
        success: false,
        code: 500,
        data: {
            error: reason || "Internal Server Error"
        }
    }
}

export const TooMany = (reason?) => {
    return {
        success: false,
        code: 429,
        data: {
            error: reason || "Too many requests"
        }
    }
}

export const Success = (data?) => {
    return {
        success: true,
        code: 200,
        data
    }
}
  