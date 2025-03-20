/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode,
  esp_ButtonAdvancedSettingAttributes,
  esp_ButtonSetting,
  esp_LanguageAttributes,
} from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./exceptions";
import { Helper } from "./helper";

export class ButtonRegistration {
  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    // Get the language code, user ID, and entity logical name
    const languageCode = Helper.getLanguageCode();
    // Check if the button setting and advanced setting exist
    const buttonSettings = (await Helper.getButtonSetting(buttonSettingName)) as esp_ButtonSetting | null;
    if (!buttonSettings) {
      ExceptionLowCodeButton.buttonSettingNotFound(buttonSettingName);
      return;
    }
    const buttonAdvancedSettings = (await Helper.getButtonAdvancedSetting(
      buttonSettings.esp_buttonsettingid ?? "",
      languageCode,
    )) as esp_ButtonAdvancedSetting | null;
    if (!buttonAdvancedSettings) {
      await ExceptionLowCodeButton.buttonAdvancedSettingNotFound(languageCode);
      return;
    }
    if (buttonAdvancedSettings.esp_showconfirmationdialog) {
      const confirmation = await Helper.openConfirmationDialogBeforeRun(buttonAdvancedSettings);
      if (!confirmation) {
        return;
      }
    }
    if (formContext.data.entity.getIsDirty() && buttonSettings.esp_savebeforerunning) {
      console.log("Saving form before running the button");
      await formContext.data.save();
    }
    await (buttonAdvancedSettings.esp_executionmode ===
    esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode.Async
      ? this.executeAsync(formContext, buttonSettings, buttonAdvancedSettings)
      : this.executeSync(formContext, buttonSettings, buttonAdvancedSettings));
  }

  static async executeAsync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    if (!buttonSetting.esp_endpoint) {
      await ExceptionLowCodeButton.noEndpointError();
      return;
    }
    let payload = {};
    if (buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: Helper.getEntityLogicalName(formContext) };
    }
    if (buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordId: Helper.getRecordId(formContext) };
    }
    if (buttonSetting.esp_includecallinguserinpayload) {
      payload = { ...payload, userId: Helper.getUserID() };
    }
    console.log("Executing async call to " + buttonSetting.esp_endpoint);
    if (buttonAdvancedSetting.esp_asyncformnotification) {
      await Helper.asyncFormNotification(formContext, buttonAdvancedSetting);
    }
    void Helper.makeRequest("POST", buttonSetting.esp_endpoint, payload).catch((error) => {
      ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
      ExceptionLowCodeButton.clearFormNotification(formContext);
      return;
    });
  }

  static async executeSync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    console.log("Executing sync call..." + buttonSetting.esp_endpoint);
  }
}
