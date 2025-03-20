/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode,
  esp_ButtonSetting,
} from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./exceptions";
import { Helper } from "./helper";
import { ErrorMessageResponse, RedirectResponse } from "./models";

export class ButtonRegistration {
  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    // Get the language code, user ID, and entity logical name
    const languageCode = Helper.getLanguageCode();
    // Check if the button setting and advanced setting exist
    const buttonSetting = (await Helper.getButtonSetting(buttonSettingName)) as esp_ButtonSetting | null;
    if (!buttonSetting) {
      ExceptionLowCodeButton.buttonSettingNotFound(buttonSettingName);
      return;
    }
    const buttonAdvancedSettings = (await Helper.getButtonAdvancedSetting(
      buttonSetting.esp_buttonsettingid ?? "",
      languageCode,
    )) as esp_ButtonAdvancedSetting | null;
    if (!buttonAdvancedSettings) {
      await ExceptionLowCodeButton.buttonAdvancedSettingNotFound(languageCode);
      return;
    }
    // Check if there should be a confirmation dialog, and if so, show it
    if (buttonAdvancedSettings.esp_showconfirmationdialog) {
      const confirmation = await Helper.openConfirmationDialogBeforeRun(buttonAdvancedSettings);
      if (!confirmation) {
        return;
      }
    }
    // Save the form if it is dirty and the setting is enabled
    if (formContext.data.entity.getIsDirty() && buttonSetting.esp_savebeforerunning) {
      console.log("Saving form before running the button");
      await formContext.data.save();
    }
    // Make sure the endpoint is set
    if (!buttonSetting.esp_endpoint) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Endpoint Not Set",
        "The endpoint for the button is not set. Please set it up in the button settings.",
      );
      return;
    }
    // Execute the button in either sync or async mode
    await (buttonAdvancedSettings.esp_executionmode ===
    esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode.Async
      ? this.executeAsync(formContext, buttonSetting, buttonAdvancedSettings)
      : this.executeSync(formContext, buttonSetting, buttonAdvancedSettings));
  }

  static async executeAsync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    console.log("Executing async call to " + buttonSetting.esp_endpoint);
    if (buttonAdvancedSetting.esp_asyncformnotification) {
      await Helper.asyncFormNotification(formContext, buttonAdvancedSetting);
    }
    void Helper.makeRequest("POST", buttonSetting.esp_endpoint!, Helper.getPayload(formContext, buttonSetting)).catch(
      async (error) => {
        await ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
        await Helper.clearFormNotification(formContext);
        return;
      },
    );
  }

  static async executeSync(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    console.log("Executing sync call..." + buttonSetting.esp_endpoint);
    // Display a form notification if the setting is enabled
    if (buttonAdvancedSetting.esp_syncformnotification) {
      await Helper.syncFormNotification(formContext, buttonAdvancedSetting);
    }
    // Display a spinner if the setting is enabled
    if (buttonAdvancedSetting.esp_syncspinner) {
      if (!buttonAdvancedSetting.esp_syncspinnertext) {
        await ExceptionLowCodeButton.showFormNotificationGenericError(
          "Sync Spinner Text Error",
          "The sync spinner text is empty! Please fill it on your configuration settings.",
        );
        return;
      }
      Xrm.Utility.showProgressIndicator(buttonAdvancedSetting.esp_syncspinnertext);
    }
    // Make the request
    const response = await Helper.makeRequest(
      "POST",
      buttonSetting.esp_endpoint!,
      Helper.getPayload(formContext, buttonSetting),
    )
      .catch(async (error) => {
        await ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
        return;
      })
      .finally(() => {
        if (buttonAdvancedSetting.esp_syncspinner) {
          Xrm.Utility.closeProgressIndicator();
          Helper.clearFormNotification(formContext);
        }
      });
    // Check if the response is an error 400 code
    if (response?.status === 400) {
      Helper.clearSyncNotifications(formContext, buttonAdvancedSetting);
      const errorMessage = ErrorMessageResponse.fromJson(await response.text());
      await ExceptionLowCodeButton.showFormNotificationGenericError(errorMessage.title!, errorMessage.message);
      return;
    }
    // Check if the response is an error 5xx code
    if ((response?.status ?? 500) >= 500) {
      Helper.clearSyncNotifications(formContext, buttonAdvancedSetting);
      const errorText = (await response?.text()) ?? "An error occurred on the server. Please try again later.";
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Error during HTTP Call",
        "Error code: " + response?.status + "\n" + errorText,
      );
      return;
    }
    // Check if the response code is 200
    if (response?.status === 200) {
      // Clear the form notification and close the spinner if the setting is enabled
      Helper.clearSyncNotifications(formContext, buttonAdvancedSetting);
      // Show a success form notification if the setting is enabled
      if (buttonAdvancedSetting.esp_syncsuccessformnotification) {
        Helper.showSuccessFormNotification(formContext, buttonAdvancedSetting);
      }
      // Show a success dialog if the setting is enabled
      if (buttonAdvancedSetting.esp_syncconfirmationbox) {
        await Helper.openSuccessDialogSync(buttonAdvancedSetting);
      }
      // Show a success dialog and redirect if the setting is enabled
      if (buttonAdvancedSetting.esp_syncconfirmationboxredirect) {
        const redirectResponse = RedirectResponse.fromJson(await response.text());
        await Helper.openSuccessDialogRedirect(formContext, buttonSetting, buttonAdvancedSetting, redirectResponse);
      }
      // Refresh the form if the setting is enabled and the redirect is not needed or is in a new tab
      Helper.reloadForm(formContext, buttonSetting, buttonAdvancedSetting);
    }
  }
}
