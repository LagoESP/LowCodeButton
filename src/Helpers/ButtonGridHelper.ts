/* eslint-disable camelcase */
import {
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode,
  esp_buttonsetting_esp_buttonsetting_esp_buttonlocation,
} from "../dataverse-gen";
import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";
import { RedirectResponse } from "../Models/BaseButtonResponseModels";
import { BaseHelper } from "./BaseHelper";

/**
 * ButtonGridHelper extends BaseHelper to provide grid-specific functionality.
 * It builds payloads with selected record GUIDs and handles grid notifications.
 */
export class ButtonGridHelper extends BaseHelper {
  globalNotificationId?: string;

  /**
   * Constructs a new ButtonGridHelper instance with the provided grid control.
   * @param selectedContext - The grid control representing the selected context.
   */
  constructor(selectedContext: Xrm.Controls.GridControl) {
    super();
    this.getButtonLocation(selectedContext);
  }

  /**
   * Returns an array containing the GUIDs of the selected records.
   * @returns An array of selected record GUIDs as lowercase strings.
   * @throws Error if the grid control is not set.
   */
  public getSelectedRecordIds(): string[] {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    const selectedRows = this.gridControl.getGrid().getSelectedRows();
    const recordIds: string[] = [];
    selectedRows.forEach((row) => {
      recordIds.push(row.data.entity.getId().replace("{", "").replace("}", "").toLowerCase());
    });
    return recordIds;
  }

  /**
   * Returns the logical name of the entity displayed in the grid.
   * @returns The entity logical name.
   * @throws Error if the grid control is not set.
   */
  public getEntityLogicalName(): string {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    return this.gridControl.getEntityName();
  }

  /**
   * Validates that at least one record is selected in the grid.
   * @returns A Promise that resolves if selection is valid.
   * @throws ExceptionLowCodeButton if no records are selected.
   */
  public async validateSelection(): Promise<boolean | void> {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    const selectedRows = this.gridControl.getGrid().getSelectedRows();
    if (selectedRows.getLength() === 0) {
      void ExceptionLowCodeButton.displayGenericErrorNotification(
        "No Records selected",
        "No records selected. Please select at least one record.",
      );
      return Promise.reject();
    }
    return Promise.resolve();
  }

  /**
   * Builds a payload for grid actions.
   * The payload includes the entity logical name, the plural name (if configured),
   * selected record GUIDs, and the calling user ID.
   * If in a subgrid, additional parent entity information is included.
   * @returns A Promise resolving to an object containing the payload data.
   * @throws Error if the grid control or button setting is not set.
   */
  public async getPayload(): Promise<Record<string, unknown>> {
    if (!this.gridControl || !this.buttonSetting) {
      throw new Error("Grid control or button setting is not set.");
    }
    let payload: Record<string, unknown> = {};
    if (this.buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: this.gridControl.getEntityName() };
      payload = { ...payload, entityLogicalPluralName: await this.getEntityPluralName(this.getEntityLogicalName()) };
      if (this.containerType === "subgrid") {
        const parentFormContext = this.getFormContextInSubgrid();
        if (parentFormContext) {
          payload = { ...payload, parentEntityLogicalName: parentFormContext.data.entity.getEntityName() };
          payload = {
            ...payload,
            parentEntityLogicalPluralName: await this.getEntityPluralName(
              parentFormContext.data.entity.getEntityName(),
            ),
          };
        }
      }
    }
    if (this.buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordIds: this.getSelectedRecordIds() };
      if (this.containerType === "subgrid") {
        const parentFormContext = this.getFormContextInSubgrid();
        if (parentFormContext) {
          payload = {
            ...payload,
            parentRecordId: parentFormContext.data.entity.getId().replace("{", "").replace("}", "").toLowerCase(),
          };
        }
      }
    }
    if (this.buttonSetting.esp_includecallinguseridinpayload) {
      payload = { ...payload, userId: this.getUserID() };
    }
    return payload;
  }

  /**
   * Opens a confirmation dialog before executing the grid action.
   * @returns A Promise that resolves to true if the user confirms the dialog, false otherwise.
   */
  public async openConfirmationDialogBeforeRun(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_confirmationdialogtext == null) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
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
   * Displays an asynchronous grid notification for 5 seconds using global notifications.
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async asyncGridNotification(): Promise<void> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_asyncformnotificationtext == null) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
        "Async Grid Notification Text Error",
        "The async grid notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    const notification: Xrm.App.Notification = {
      level: XrmEnum.AppNotificationLevel.Information,
      message: this.buttonAdvancedSetting.esp_asyncformnotificationtext,
      type: 2,
      showCloseButton: true,
    };
    Xrm.App.addGlobalNotification(notification).then((id) => {
      this.globalNotificationId = id;
      setTimeout(() => {
        this.clearGridNotification();
      }, 5000);
    });
  }

  /**
   * Clears the grid notification using the stored global notification ID.
   * @throws Error if no notification is currently set.
   */
  public clearGridNotification(): void {
    if (this.globalNotificationId) {
      Xrm.App.clearGlobalNotification(this.globalNotificationId);
      this.globalNotificationId = undefined;
    }
  }

  /**
   * Displays a synchronous grid notification for 120 seconds using global notifications.
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async syncGridNotification(): Promise<void> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_syncformnotificationtext == null) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
        "Sync Grid Notification Text Error",
        "The sync grid notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    const notification: Xrm.App.Notification = {
      level: XrmEnum.AppNotificationLevel.Information,
      message: this.buttonAdvancedSetting.esp_syncformnotificationtext,
      type: 2,
    };
    Xrm.App.addGlobalNotification(notification).then((id) => {
      this.globalNotificationId = id;
      setTimeout(() => {
        this.clearGridNotification();
      }, 120000);
    });
  }

  /**
   * Clears all synchronous notifications, including grid notifications and progress indicators.
   * @returns A Promise that resolves when the notifications are cleared.
   */
  public async clearSyncNotifications(): Promise<void> {
    if (this.buttonAdvancedSetting?.esp_syncformnotification) {
      await this.clearGridNotification();
    }
    if (this.buttonAdvancedSetting?.esp_syncspinner) {
      Xrm.Utility.closeProgressIndicator();
    }
  }

  /**
   * Displays a success grid notification for 5 seconds using global notifications.
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async showSuccessGridNotification(): Promise<void> {
    if (
      !this.gridControl ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
        "Success Notification Text Error",
        "The success notification text is empty! Please fill it on your configuration settings.\nField: esp_syncsuccessformnotificationtext",
      );
      return;
    }
    const notification: Xrm.App.Notification = {
      level: XrmEnum.AppNotificationLevel.Information,
      message: this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext,
      type: 2,
      showCloseButton: true,
    };
    Xrm.App.addGlobalNotification(notification).then((id) => {
      this.globalNotificationId = id;
      setTimeout(() => {
        this.clearGridNotification();
      }, 5000);
    });
  }

  /**
   * Opens a synchronous success dialog and awaits the user's confirmation.
   * @returns A Promise that resolves to true if the success dialog is confirmed, or false otherwise.
   */
  public async openSuccessDialogSync(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_syncconfirmationboxtext == null) {
      await ExceptionLowCodeButton.displayGenericErrorNotification(
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
   * If confirmed, the browser is redirected; otherwise, the grid is reloaded.
   * @param response - An object containing the redirect URI.
   */
  public openSuccessDialogRedirect(response: RedirectResponse): void {
    if (!this.buttonAdvancedSetting) {
      throw new Error("Button advanced setting is not set.");
    }
    if (this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext == null) {
      ExceptionLowCodeButton.displayGenericErrorNotification(
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
        console.log("User cancelled the dialog, refreshing the grid.");
        this.reloadGrid();
      }
    });
  }

  /**
   * Reloads the grid and, if in a subgrid, reloads the parent form.
   */
  public reloadGrid(): void {
    if (!this.gridControl || !this.buttonSetting || !this.buttonAdvancedSetting) {
      throw new Error("Required properties are not set for reloading the grid.");
    }
    if (
      this.buttonSetting.esp_refreshwhenapicallends &&
      !(
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirect &&
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
      )
    ) {
      this.gridControl.refresh();
    }
    if (this.containerType === "subgrid") {
      this.reloadForm();
    }
  }

  /**
   * Reloads the parent form for subgrid contexts.
   * @returns The parent form context if available.
   * @throws Error if required properties are not set or the container is not a subgrid.
   */
  public reloadForm(): void {
    if (!this.formContext || !this.buttonSetting || !this.buttonAdvancedSetting || this.containerType !== "subgrid") {
      throw new Error("Required properties are not set for reloading the form.");
    }
    if (
      this.buttonSetting.esp_refreshwhenapicallends &&
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
   * Retrieves the parent form context when the grid is embedded as a subgrid.
   * @returns The parent form context or null if not available.
   */
  public getFormContextInSubgrid(): Xrm.FormContext | null {
    if (
      this.buttonSetting!.esp_buttonlocation === esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid &&
      this.containerType === "subgrid"
    ) {
      console.log("Subgrid detected. Setting form context to parent form.");
      // Cast gridControl as any to access the formContext property.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tempControl = this.gridControl as any;
      return tempControl.formContext as Xrm.FormContext;
    }
    return null;
  }
}
