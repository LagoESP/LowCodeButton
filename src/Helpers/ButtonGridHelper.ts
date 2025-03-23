/* eslint-disable camelcase */
import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";
import { BaseHelper } from "./BaseHelper";

/**
 * ButtonGridHelper extends BaseHelper to provide grid-specific functionality.
 * It uses a selected grid context to build a payload containing the selected record GUIDs.
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
   * Returns an object containing the selected record GUIDs.
   * Keys are in the format "record0", "record1", etc.
   * @returns An object mapping record keys to GUID strings.
   * @throws Error if the grid control is not set.
   */
  public getSelectedRecordIds(): { [key: string]: string } {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    const selectedRows = this.gridControl.getGrid().getSelectedRows();
    const recordIds: { [key: string]: string } = {};
    let index = 0;
    selectedRows.forEach((row) => {
      const id = row.data.entity.getId().replace("{", "").replace("}", "").toLowerCase();
      recordIds[`record${index}`] = id;
      index++;
    });
    return recordIds;
  }

  /**
   * Returns the logical name of the entity in the grid.
   * @returns The logical name of the entity in the grid.
   * @throws Error if the grid control is not set.
   */
  public getEntityLogicalName(): string {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    return this.gridControl.getEntityName();
  }

  /**
   * Checks if there are any selected records.
   * @throws ExceptionLowCodeButton if no records are selected.
   */
  public async validateSelection(): Promise<boolean | void> {
    if (!this.gridControl) {
      throw new Error("Grid control is not set.");
    }
    const selectedRows = this.gridControl.getGrid().getSelectedRows();
    if (selectedRows.getLength() === 0) {
      void ExceptionLowCodeButton.showFormNotificationGenericError(
        "No Records selected",
        "No records selected. Please select at least one record.",
      );
      return Promise.reject();
    }
    return Promise.resolve();
  }

  /**
   * Builds a payload for grid actions.
   * The payload includes the entity logical name (if configured), an object of selected record GUIDs,
   * and the calling user ID (if configured).
   * @returns An object containing the payload data.
   * @throws Error if the grid control or button setting is not set.
   */
  public getPayload(): Record<string, unknown> {
    if (!this.gridControl || !this.buttonSetting) {
      throw new Error("Grid control or button setting is not set.");
    }
    let payload: Record<string, unknown> = {};
    if (this.buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: this.gridControl.getEntityName() };
    }
    if (this.buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordIds: this.getSelectedRecordIds() };
    }
    if (this.buttonSetting.esp_includecallinguseridinpayload) {
      payload = { ...payload, userId: this.getUserID() };
    }
    debugger;
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
   * Displays an asynchronous grid notification for 5 seconds using global notifications.
   *
   * @returns A Promise that resolves when the notification is cleared.
   */
  public async asyncGridNotification(): Promise<void> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_asyncformnotificationtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
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
   *
   * @throws Error if there is no notification to clear.
   */
  public clearGridNotification(): void {
    if (this.globalNotificationId) {
      Xrm.App.clearGlobalNotification(this.globalNotificationId);
      this.globalNotificationId = undefined;
    }
  }
}
