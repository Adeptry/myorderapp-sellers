import { ErrorResponse } from "myorderapp-square";

export function isErrorResponse(error: any): error is ErrorResponse {
  return error != null;
}
