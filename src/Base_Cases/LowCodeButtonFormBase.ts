/* eslint-disable camelcase */
import {
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype,
} from "../dataverse-gen";
import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";
import { ButtonFormHelper } from "../Helpers/ButtonFormHelper";
import { ErrorMessageResponse, RedirectResponse } from "../Models/BaseButtonResponseModels";

export class ButtonRegistrationForm {
  /**
   * Handles the onClick event for the button inside a Form.
   * @param formContext - The form context.
   * @param buttonSettingName - The name of the button setting.
   */
  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    const buttonHelper = new ButtonFormHelper(formContext);
    await buttonHelper.initializeSettings(buttonSettingName);

    if (buttonHelper.buttonAdvancedSetting!.esp_showconfirmationdialog) {
      const confirmation = await buttonHelper.openConfirmationDialogBeforeRun();
      if (!confirmation) {
        return;
      }
    }

    if (formContext.data.entity.getIsDirty() && buttonHelper.buttonSetting!.esp_savebeforerunning) {
      console.log("Saving form before running the button");
      await formContext.data.save();
    }

    if (!buttonHelper.buttonSetting!.esp_endpoint) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
        "Endpoint Not Set",
        "The endpoint for the button is not set. Please set it up in the button settings.",
      );
      return;
    }

    if (
      buttonHelper.buttonAdvancedSetting!.esp_executionmode ===
      esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode.Async
    ) {
      await this.executeAsync(buttonHelper);
    } else {
      await this.executeSync(buttonHelper);
    }
  }

  /**
   * Executes an asynchronous HTTP call.
   * @param buttonHelper - The initialized ButtonFormHelper instance.
   */
  static async executeAsync(buttonHelper: ButtonFormHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing async call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_asyncformnotification) {
      void buttonHelper.asyncFormNotification();
    }
    buttonHelper
      .makeRequest("POST", buttonSetting!.esp_endpoint!, await buttonHelper.getPayload())
      .catch(async (error) => {
        await ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call", error.message);
        await buttonHelper.clearFormNotification();
      });
  }

  /**
   * Executes a synchronous HTTP call.
   * @param buttonHelper - The initialized ButtonFormHelper instance.
   */
  static async executeSync(buttonHelper: ButtonFormHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing sync call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_syncformnotification) {
      await buttonHelper.syncFormNotification();
    }
    if (buttonAdvancedSetting?.esp_syncspinner) {
      if (!buttonAdvancedSetting.esp_syncspinnertext) {
        await ExceptionLowCodeButton.displayGenericErrorNotification(
          "Sync Spinner Text Error",
          "The sync spinner text is empty! Please fill it on your configuration settings.",
        );
        return;
      }
      Xrm.Utility.showProgressIndicator(buttonAdvancedSetting.esp_syncspinnertext);
    }
    const response = await buttonHelper
      .makeRequest("POST", buttonSetting!.esp_endpoint!, await buttonHelper.getPayload())
      .catch(async (error) => {
        await ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call", error.message);
        return;
      })
      .finally(() => {
        if (buttonAdvancedSetting?.esp_syncspinner) {
          Xrm.Utility.closeProgressIndicator();
          buttonHelper.clearFormNotification();
        }
      });

    if (!response) return;

    if (response.status === 400) {
      buttonHelper.clearSyncNotifications();
      const errorMessage = ErrorMessageResponse.fromJson(await response.text());
      await ExceptionLowCodeButton.displayGenericErrorNotification(errorMessage.title!, errorMessage.message);
      return;
    }
    if ((response.status ?? 500) >= 500) {
      buttonHelper.clearSyncNotifications();
      const errorText = (await response.text()) ?? "An error occurred on the server. Please try again later.";
      await ExceptionLowCodeButton.displayGenericErrorNotification(
        "Error during HTTP Call",
        `Error code: ${response.status}\n${errorText}`,
      );
      return;
    }
    if (response.status === 200) {
      buttonHelper.clearSyncNotifications();
      if (buttonAdvancedSetting?.esp_syncsuccessformnotification) {
        await buttonHelper.showSuccessFormNotification();
      }
      if (
        buttonAdvancedSetting?.esp_syncconfirmationboxtype ===
        esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype.Default
      ) {
        await buttonHelper.openSuccessDialogSync();
      }
      if (
        buttonAdvancedSetting?.esp_syncconfirmationboxtype ===
        esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype.Redirect
      ) {
        const redirectResponse = RedirectResponse.fromJson(await response.text());
        buttonHelper.openSuccessDialogRedirect(redirectResponse);
      }
      buttonHelper.reloadForm();
    }
  }
}
