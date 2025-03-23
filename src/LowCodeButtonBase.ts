import { ButtonRegistrationForm } from "./LowCodeButtonFormBase";
import { BaseHelper } from "./Helpers/BaseHelper";
import { ExceptionLowCodeButton } from "./Exceptions/ButtonException";
import { ButtonRegistrationGrid } from "./LowCodeButtonGridBase";

export class ButtonRegistration {
  static onClick(context: Xrm.FormContext | Xrm.Controls.GridControl, buttonSettingName: string) {
    if (!context) {
      ExceptionLowCodeButton.displayGenericErrorNotification("Registration Error", "No context provided");
      return;
    }
    if (!buttonSettingName) {
      ExceptionLowCodeButton.displayGenericErrorNotification("Registration Error", "No button setting name provided");
      return;
    }
    const baseHelper = new BaseHelper();
    baseHelper.getButtonLocation(context);
    switch (baseHelper.containerType!) {
      case "form":
        ButtonRegistrationForm.onClick(context as Xrm.FormContext, buttonSettingName);
        break;
      case "grid":
      case "subgrid":
        ButtonRegistrationGrid.onClick(context as Xrm.Controls.GridControl, buttonSettingName);
        break;
      default:
        console.log("Unknown button location");
        break;
    }
  }
}
