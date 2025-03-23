import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";

/**
 * RedirectResponse encapsulates a redirect URI.
 */
export class RedirectResponse {
  redirectUri: string;

  /**
   * Creates a new instance of RedirectResponse.
   * @param redirectUri - The URI to which the user should be redirected.
   */
  constructor(redirectUri: string) {
    this.redirectUri = redirectUri;
  }

  /**
   * Parses a JSON string to create a RedirectResponse instance.
   * Expects the JSON to contain a "redirectUri" property of type string.
   * If the property is missing or invalid, displays a generic error notification
   * and throws an error.
   *
   * @param json - The JSON string to parse.
   * @returns A new RedirectResponse instance.
   * @throws Error if the JSON format is invalid or "redirectUri" is not a string.
   */
  static fromJson(json: string): RedirectResponse {
    const data = JSON.parse(json);
    if (typeof data.redirectUri !== "string") {
      ExceptionLowCodeButton.displayGenericErrorNotification(
        "Redirect URI Not Found",
        "The redirect URI was not found in the response.",
      );
      throw new Error("Invalid JSON format for RedirectResponse");
    }
    return new RedirectResponse(data.redirectUri);
  }
}

/**
 * ErrorMessageResponse encapsulates an error message along with an optional title.
 */
export class ErrorMessageResponse {
  title?: string;
  message: string;

  /**
   * Creates a new instance of ErrorMessageResponse.
   * @param message - The error message.
   * @param title - An optional title for the error.
   */
  constructor(message: string, title?: string) {
    this.message = message;
    this.title = title;
  }

  /**
   * Parses a JSON string to create an ErrorMessageResponse instance.
   * Expects the JSON to contain a "message" property of type string.
   * If the property is missing or invalid, displays a generic error notification
   * and throws an error.
   *
   * @param json - The JSON string to parse.
   * @returns A new ErrorMessageResponse instance.
   * @throws Error if the JSON format is invalid or "message" is not a string.
   */
  static fromJson(json: string): ErrorMessageResponse {
    const data = JSON.parse(json);
    console.log("Error message data", data);
    if (typeof data.message !== "string") {
      ExceptionLowCodeButton.displayGenericErrorNotification(
        "Error Message Not Found",
        "The error message was not found in the response.",
      );
      throw new Error("Invalid JSON format for ErrorMessage");
    }
    return new ErrorMessageResponse(data.message, data.title ?? "");
  }
}
