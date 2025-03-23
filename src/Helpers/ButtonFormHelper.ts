/* eslint-disable camelcase */
import { esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode } from "../dataverse-gen";
import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";
import { RedirectResponse } from "../Models/BaseButtonResponseModels";
import { BaseHelper } from "./BaseHelper"; // Adjust path as needed

/**
 * ButtonFormHelper extends BaseHelper to provide form-specific functionality.
 * It accepts only a Xrm.FormContext as the context.
 */
export class ButtonFormHelper extends BaseHelper {
  /**
   * Constructs a new ButtonFormHelper instance with the provided FormContext.
   *
   * @param formContext - The Xrm.FormContext representing the current form.
   */
  constructor(formContext: Xrm.FormContext) {
    super();
    // Set the context and container type using the BaseHelper's method.
    this.getButtonLocation(formContext);
  }

  /**
   * Static factory method to create and initialize a ButtonFormHelper instance.
   *
   * @param formContext - The Xrm.FormContext representing the current form.
   * @param buttonSettingName - The name of the button setting to retrieve.
   * @returns A Promise that resolves to an initialized ButtonFormHelper instance.
   */
  public static async create(formContext: Xrm.FormContext, buttonSettingName: string): Promise<ButtonFormHelper> {
    const helper = new ButtonFormHelper(formContext);
    await helper.initializeSettings(buttonSettingName);
    return helper;
  }

  /**
   * Retrieves the entity logical name from the current form context.
   *
   * @returns The entity logical name.
   * @throws Error if the form context is not set.
   */
  public getEntityLogicalName(): string {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    return this.formContext.data.entity.getEntityName();
  }

  /**
   * Retrieves the record ID from the current form context.
   *
   * @returns The record ID as a lowercase string without curly braces.
   * @throws Error if the form context is not set.
   */
  public getRecordId(): string {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    return this.formContext.data.entity.getId().replace("{", "").replace("}", "").toLowerCase();
  }

  /**
   * Builds a payload based on the button setting configuration and form context.
   *
   * The payload may include the entity logical name, record ID, and user ID,
   * according to the configuration flags in the button setting.
   *
   * @returns An object containing the payload data.
   * @throws Error if the form context or button setting is not set.
   */
  public getPayload(): Record<string, unknown> {
    if (!this.formContext || !this.buttonSetting) {
      throw new Error("Form context or button setting is not set.");
    }
    let payload: Record<string, unknown> = {};
    if (this.buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: this.getEntityLogicalName() };
    }
    if (this.buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordId: this.getRecordId() };
    }
    if (this.buttonSetting.esp_includecallinguseridinpayload) {
      payload = { ...payload, userId: this.getUserID() };
    }
    return payload;
  }

  /**
   * Opens a confirmation dialog before executing the button action.
   *
   * @returns A Promise that resolves to true if the user confirms the dialog, false otherwise.
   */
  public async openConfirmationDialogBeforeRun(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_confirmationdialogtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Confirmation Dialog Text Error",
        "The confirmation dialog text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: this.buttonAdvancedSetting.esp_confirmationdialogcancellabel ?? "",
      confirmButtonLabel: this.buttonAdvancedSetting.esp_confirmationdialogconfirmlabel ?? "",
      subtitle: this.buttonAdvancedSetting.esp_confirmationdialogsubtitle ?? "",
      text: this.buttonAdvancedSetting.esp_confirmationdialogtext ?? "",
      title: this.buttonAdvancedSetting.esp_confirmationdialogtitle!,
    };
    const result = await Xrm.Navigation.openConfirmDialog(confirmStrings);
    return result.confirmed;
  }

  /**
   * Opens a synchronous success dialog and awaits the user's confirmation.
   *
   * @returns A Promise that resolves to true if the success dialog is confirmed, or false otherwise.
   */
  public async openSuccessDialogSync(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_syncconfirmationboxtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Text Error",
        "The sync confirmation box text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      confirmButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxconfirmlabel ?? undefined,
      text: this.buttonAdvancedSetting.esp_syncconfirmationboxtext ?? undefined,
      title: this.buttonAdvancedSetting.esp_syncconfirmationboxtitle!,
    };
    const result = await Xrm.Navigation.openAlertDialog(confirmStrings);
    return result.confirmed;
  }

  /**
   * Opens a success dialog that may redirect the user based on their confirmation.
   * If the user confirms, the browser is redirected; otherwise, the form is reloaded.
   *
   * @param response - An object containing the redirect URI.
   */
  public openSuccessDialogRedirect(response: RedirectResponse): void {
    if (!this.buttonAdvancedSetting) {
      throw new Error("Button advanced setting is not set.");
    }
    if (this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext == null) {
      ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Redirect Text Error",
        "The sync confirmation box redirect text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectcancellabel ?? undefined,
      confirmButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectconfirmlabel ?? undefined,
      text: this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext!,
      subtitle: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectsubtitle ?? undefined,
      title: this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttitle ?? undefined,
    };
    Xrm.Navigation.openConfirmDialog(confirmStrings).then((result) => {
      if (result.confirmed) {
        console.log("User confirmed the dialog, redirecting...");
        if (
          this.buttonAdvancedSetting!.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
        ) {
          window.open(response.redirectUri, "_self")!.focus();
        } else {
          window.open(response.redirectUri, "_blank")!.focus();
        }
      } else {
        console.log("User cancelled the dialog, refreshing the form.");
        this.reloadForm();
      }
    });
  }

  /**
   * Reloads the current form.
   *
   * @throws Error if the form context, button setting, or advanced setting is not set.
   */
  public reloadForm(): void {
    if (!this.formContext || !this.buttonSetting || !this.buttonAdvancedSetting) {
      throw new Error("Required properties are not set for reloading the form.");
    }
    if (
      this.buttonSetting.esp_refreshformwhenapicallends &&
      !(
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirect &&
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
      )
    ) {
      this.formContext.data.refresh(false);
    }
  }

  /**
   * Displays an asynchronous form notification for 5 seconds.
   *
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async asyncFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_asyncformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Async Form Notification Text Error",
        "The async form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_asyncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  /**
   * Clears the form notification from the current form.
   *
   * @throws Error if the form context is not set.
   */
  public clearFormNotification(): void {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    this.formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
  }

  /**
   * Displays a synchronous form notification for 120 seconds.
   *
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async syncFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_syncformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Form Notification Text Error",
        "The sync form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_syncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 120000);
  }

  /**
   * Displays a success form notification for 5 seconds.
   *
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async showSuccessFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Success Form Notification Text Error",
        "The success form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  /**
   * Clears all synchronous notifications including form notifications and progress indicators.
   */
  public clearSyncNotifications(): void {
    if (this.buttonAdvancedSetting?.esp_syncformnotification) {
      this.clearFormNotification();
    }
    if (this.buttonAdvancedSetting?.esp_syncspinner) {
      Xrm.Utility.closeProgressIndicator();
    }
  }
}
