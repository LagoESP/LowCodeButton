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
}
