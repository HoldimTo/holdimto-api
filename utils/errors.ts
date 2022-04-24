export enum ApiError {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export const ApiErrorCodes = {
  [ApiError.NOT_FOUND]: 404,
  [ApiError.INTERNAL_ERROR]: 500
}
