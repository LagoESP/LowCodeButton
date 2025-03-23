/* eslint-disable camelcase */
import { esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode } from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./Exceptions/ButtonException";
import { ButtonGridHelper } from "./Helpers/ButtonGridHelper";
import { ErrorMessageResponse, RedirectResponse } from "./Models/BaseButtonResponseModels";

export class ButtonRegistrationGrid {
  /**
   * Handles the onClick event for grid buttons.
   * @param gridControl - The grid control representing the selected records.
   * @param buttonSettingName - The name of the button setting.
   */
  static async onClick(gridControl: Xrm.Controls.GridControl, buttonSettingName: string) {
    const buttonHelper = new ButtonGridHelper(gridControl);
    await buttonHelper.initializeSettings(buttonSettingName);
    if (await buttonHelper.validateSelection()) {
      return;
    }

    if (buttonHelper.buttonAdvancedSetting!.esp_showconfirmationdialog) {
      const confirmation = await buttonHelper.openConfirmationDialogBeforeRun();
      if (!confirmation) {
        return;
      }
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
   * Executes an asynchronous HTTP call for grid actions.
   * @param buttonHelper - The initialized ButtonGridHelper instance.
   */
  static async executeAsync(buttonHelper: ButtonGridHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing async call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_asyncformnotification) {
      void buttonHelper.asyncGridNotification();
    }
    buttonHelper
      .makeRequest("POST", buttonSetting!.esp_endpoint!, await buttonHelper.getPayload())
      .catch(async (error) => {
        await ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call", error.message);
      });
  }

  /**
   * Executes a synchronous HTTP call for grid actions.
   * @param buttonHelper - The initialized ButtonGridHelper instance.
   */
  static async executeSync(buttonHelper: ButtonGridHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing sync call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_syncformnotification) {
      await buttonHelper.syncGridNotification();
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
        }
        if (buttonAdvancedSetting?.esp_syncformnotification) {
          void buttonHelper.clearGridNotification();
        }
      });

    if (!response) return;

    if (response.status === 400) {
      const errorMessage = ErrorMessageResponse.fromJson(await response.text());
      await ExceptionLowCodeButton.displayGenericErrorNotification(errorMessage.title!, errorMessage.message);
      return;
    }

    if ((response.status ?? 500) >= 500) {
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
        await buttonHelper.showSuccessGridNotification();
      }
      if (buttonAdvancedSetting?.esp_syncconfirmationbox) {
        await buttonHelper.openSuccessDialogSync();
      }
      if (buttonAdvancedSetting?.esp_syncconfirmationboxredirect) {
        const redirectResponse = RedirectResponse.fromJson(await response.text());
        buttonHelper.openSuccessDialogRedirect(redirectResponse);
      }
      buttonHelper.reloadGrid();
    }
  }
}
