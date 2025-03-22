/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import { esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode } from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./Exceptions/ButtonException";
import { ButtonHelper } from "./Helpers/FormBaseButtonHelper";
import { ErrorMessageResponse, RedirectResponse } from "./Models/BaseButtonResponseModels";

export class ButtonRegistration {
  static determineContext(control: unknown): "form" | "grid" | "subgrid" | "unknown" {
    // Check if control is a form context
    if ((control as Xrm.FormContext).data) {
      alert("The control is on a main form.");
      return "form";
    }
    // Check if control is a grid control
    else if ((control as Xrm.Controls.GridControl).getGrid) {
      // Differentiate between main grid and subgrid
      if ((control as Xrm.Controls.GridControl).getParent && (control as Xrm.Controls.GridControl).getParent()) {
        alert("The control is on a subgrid.");
        return "subgrid";
      } else {
        alert("The control is on a main grid.");
        return "grid";
      }
    }
    alert("Unknown context.");
    return "unknown";
  }

  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    // Create a buttonHelper instance with the form context
    const buttonHelper = new ButtonHelper(formContext);

    // Get language code and fetch the button setting
    const languageCode = buttonHelper.getLanguageCode();
    const buttonSetting = await buttonHelper.getButtonSetting(buttonSettingName);
    if (!buttonSetting) {
      ExceptionLowCodeButton.buttonSettingNotFound(buttonSettingName);
      return;
    }

    // Fetch the advanced setting using the button setting ID and language code
    const buttonAdvancedSetting = await buttonHelper.getButtonAdvancedSetting(
      buttonSetting.esp_buttonsettingid ?? "",
      languageCode,
    );
    if (!buttonAdvancedSetting) {
      await ExceptionLowCodeButton.buttonAdvancedSettingNotFound(languageCode);
      return;
    }

    // Optionally show a confirmation dialog before proceeding
    if (buttonAdvancedSetting.esp_showconfirmationdialog) {
      const confirmation = await buttonHelper.openConfirmationDialogBeforeRun();
      if (!confirmation) {
        return;
      }
    }

    // Save the form if it is dirty and the configuration requires it
    if (formContext.data.entity.getIsDirty() && buttonSetting.esp_savebeforerunning) {
      console.log("Saving form before running the button");
      await formContext.data.save();
    }

    // Ensure the endpoint is set before making a request
    if (!buttonSetting.esp_endpoint) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Endpoint Not Set",
        "The endpoint for the button is not set. Please set it up in the button settings.",
      );
      return;
    }

    // Execute in async or sync mode based on the advanced setting
    if (
      buttonAdvancedSetting.esp_executionmode ===
      esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode.Async
    ) {
      await this.executeAsync(buttonHelper);
    } else {
      await this.executeSync(buttonHelper);
    }
  }

  static async executeAsync(buttonHelper: ButtonHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing async call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_asyncformnotification) {
      await buttonHelper.asyncFormNotification();
    }
    buttonHelper.makeRequest("POST", buttonSetting!.esp_endpoint!, buttonHelper.getPayload()).catch(async (error) => {
      await ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
      await buttonHelper.clearFormNotification();
    });
  }

  static async executeSync(buttonHelper: ButtonHelper) {
    const { buttonSetting, buttonAdvancedSetting } = buttonHelper;
    console.log(`Executing sync call to ${buttonSetting?.esp_endpoint}`);
    if (buttonAdvancedSetting?.esp_syncformnotification) {
      await buttonHelper.syncFormNotification();
    }
    if (buttonAdvancedSetting?.esp_syncspinner) {
      if (!buttonAdvancedSetting.esp_syncspinnertext) {
        await ExceptionLowCodeButton.showFormNotificationGenericError(
          "Sync Spinner Text Error",
          "The sync spinner text is empty! Please fill it on your configuration settings.",
        );
        return;
      }
      Xrm.Utility.showProgressIndicator(buttonAdvancedSetting.esp_syncspinnertext);
    }
    const response = await buttonHelper
      .makeRequest("POST", buttonSetting!.esp_endpoint!, buttonHelper.getPayload())
      .catch(async (error) => {
        await ExceptionLowCodeButton.showFormNotificationGenericError("Error during HTTP Call", error.message);
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
      await ExceptionLowCodeButton.showFormNotificationGenericError(errorMessage.title!, errorMessage.message);
      return;
    }
    if ((response.status ?? 500) >= 500) {
      buttonHelper.clearSyncNotifications();
      const errorText = (await response.text()) ?? "An error occurred on the server. Please try again later.";
      await ExceptionLowCodeButton.showFormNotificationGenericError(
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
      if (buttonAdvancedSetting?.esp_syncconfirmationbox) {
        await buttonHelper.openSuccessDialogSync();
      }
      if (buttonAdvancedSetting?.esp_syncconfirmationboxredirect) {
        const redirectResponse = RedirectResponse.fromJson(await response.text());
        buttonHelper.openSuccessDialogRedirect(redirectResponse);
      }
      buttonHelper.reloadForm();
    }
  }
}
