/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode,
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
      const confirmation = await Utils.openConfirmationDialogBeforeRun(buttonAdvancedSettings);
      if (!confirmation) {
        return;
      }
    }
    await (buttonAdvancedSettings.esp_executionmode ===
    esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode.Async
      ? this.executeAsync(formContext, buttonSettings, buttonAdvancedSettings)
      : this.executeSync(formContext, buttonSettings, buttonAdvancedSettings));
  }

  static async executeAsync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSettings,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    if (!buttonSetting.esp_endpoint) {
      await ExceptionLowCodeButton.noEndpointError();
      return;
    }
    if (buttonAdvancedSetting.esp_asyncformnotification) {
      await Utils.asyncFormNotification(formContext, buttonAdvancedSetting);
    }
    console.log("Executing async call to " + buttonSetting.esp_endpoint);
    let payload = {};
    if (buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: Utils.getEntityLogicalName(formContext) };
    }
    if (buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordId: Utils.getRecordId(formContext) };
    }
    if (buttonSetting.esp_includecallinguserinpayload) {
      payload = { ...payload, userId: Utils.getUserID() };
    }
    void Utils.makeRequest("POST", buttonSetting.esp_endpoint, payload).catch((error) => {
      ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
      ExceptionLowCodeButton.clearFormNotification(formContext);
      return;
    });
  }

  static async executeSync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSettings,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    console.log("Executing sync call..." + buttonSetting.esp_endpoint);
  }
}
