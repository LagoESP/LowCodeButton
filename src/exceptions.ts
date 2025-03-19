export class ExceptionLowCodeButton {
  static async buttonSettingNotFound(buttonSettingName: string) {
    const errorStrings = {
      text: `Button setting not found: ${buttonSettingName}`,
      title: "Button Setting Not Found",
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }

  static async buttonAdvancedSettingNotFound(lcid: number) {
    const errorStrings = {
      text: `Button advanced setting not found for the LCID ${lcid}`,
      title: "Button Advanced Setting Not Found",
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }

  static async showConfirmationDialogError() {
    const errorStrings = {
      text: "The confirmation dialog title is empty! Please fill it on your configuration settings.",
      title: "Confirmation Dialog Title Error",
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }

  static async showFormNotificationMissingTextError() {
    const errorStrings = {
      text: "The async form notification text is empty! Please fill it on your configuration settings.",
      title: "Async Form Notification Text Error",
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }

  static async showFormNotificationGenericError(title: string, text: string) {
    const errorStrings = {
      text,
      title,
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }

  static async clearFormNotification(formContext: Xrm.FormContext) {
    formContext.ui.clearFormNotification("LowCodeButtonAsyncNotification");
  }

  static async noEndpointError() {
    const errorStrings = {
      text: "The endpoint is empty! Please fill it on your configuration settings.",
      title: "No Endpoint Error",
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }
}
