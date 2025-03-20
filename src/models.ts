import { ExceptionLowCodeButton } from "./exceptions";

export class RedirectResponse {
  redirectUri: string;

  constructor(redirectUri: string) {
    this.redirectUri = redirectUri;
  }

  static fromJson(json: string): RedirectResponse {
    const data = JSON.parse(json);
    if (typeof data.redirectUri !== "string") {
      ExceptionLowCodeButton.showFormNotificationGenericError(
        "Redirect URI Not Found",
        "The redirect URI was not found in the response.",
      );
      throw new Error("Invalid JSON format for RedirectResponse");
    }
    return new RedirectResponse(data.redirectUri);
  }
}

export class ErrorMessageResponse {
  title?: string;
  message: string;

  constructor(message: string, title?: string) {
    this.message = message;
    this.title = title;
  }

  static fromJson(json: string): ErrorMessageResponse {
    const data = JSON.parse(json);
    console.log("Error message data", data);
    if (typeof data.message !== "string") {
      ExceptionLowCodeButton.showFormNotificationGenericError(
        "Error Message Not Found",
        "The error message was not found in the response.",
      );
      throw new Error("Invalid JSON format for ErrorMessage");
    }
    return new ErrorMessageResponse(data.message, data.title ?? "");
  }
}
