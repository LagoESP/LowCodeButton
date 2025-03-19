/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_ButtonAdvancedSettingAttributes,
  esp_ButtonSettings,
  esp_LanguageAttributes,
} from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./exceptions";
import { Utils } from "./utils";

export class ButtonRegistration {
  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    // Get the language code, user ID, and entity logical name
    const languageCode = Utils.getLanguageCode();
    const userId = Utils.getUserID();
    const entityLogicalName = Utils.getEntityLogicalName(formContext);
    // Check if the button setting and advanced setting exist
    const buttonSettings = (await Utils.getButtonSetting(buttonSettingName)) as esp_ButtonSettings | null;
    if (!buttonSettings) {
      ExceptionLowCodeButton.buttonSettingNotFound(buttonSettingName);
      return;
    }
    const buttonAdvancedSettings = (await Utils.getButtonAdvancedSetting(
      buttonSettings.esp_buttonsettingsid ?? "",
      languageCode,
    )) as esp_ButtonAdvancedSetting | null;
    if (!buttonAdvancedSettings) {
      await ExceptionLowCodeButton.buttonAdvancedSettingNotFound(languageCode);
      return;
    }
    if (buttonAdvancedSettings.esp_showconfirmationdialog) {
      if (buttonAdvancedSettings.esp_confirmationdialogtext == null) {
        await ExceptionLowCodeButton.showConfirmationDialogError();
        return;
      } else {
        const confirmation = await ButtonRegistration.showConfirmationDialog(buttonAdvancedSettings, entityLogicalName);
        if (!confirmation) {
          return;
        }
      }
    }
    alert("Button clicked!");
  }

  static async showConfirmationDialog(buttonAdvancedSettings: esp_ButtonAdvancedSetting, entityLogicalName: string) {
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: buttonAdvancedSettings.esp_confirmationdialogcancellabel ?? "",
      confirmButtonLabel: buttonAdvancedSettings.esp_confirmationdialogconfirmlabel ?? "",
      subtitle: buttonAdvancedSettings.esp_confirmationdialogsubtitle ?? "",
      text: buttonAdvancedSettings.esp_confirmationdialogtext ?? "",
      title: buttonAdvancedSettings.esp_confirmationdialogtitle!,
    };
    const result = await Xrm.Navigation.openConfirmDialog(confirmStrings);
    return result.confirmed;
  }
}
