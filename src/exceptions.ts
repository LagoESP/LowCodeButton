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

  static async showFormNotificationGenericError(title: string, text: string) {
    const errorStrings = {
      text: text,
      title: title,
    };
    await Xrm.Navigation.openAlertDialog(errorStrings);
  }
}
