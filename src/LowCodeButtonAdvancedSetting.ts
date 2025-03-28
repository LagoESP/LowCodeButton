/* eslint-disable camelcase */
/// <reference types="xrm" />

import { esp_ButtonAdvancedSettingAttributes } from "./dataverse-gen";
import { BaseHelper } from "./Helpers/BaseHelper";

// Logic for form Onload and Onchange
export class FormLogic {
  public static async filterLanguage(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext();
    const helper = new BaseHelper();
    const mainButtonSetting = formContext
      .getAttribute(esp_ButtonAdvancedSettingAttributes.esp_MainButtonSetting)
      ?.getValue();
    const language = formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SettingLanguage)?.getValue();
    if (!mainButtonSetting) {
      return;
    }
    const mainButtonSettingId = mainButtonSetting[0].id.replace(/[{}]/g, "");
    let languageId = "";
    if (language) {
      languageId = language[0].id.replace(/[{}]/g, "");
    }
    debugger;
    const filter = await helper.getFilterLookupForLanguage(mainButtonSettingId, languageId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lookup = formContext.getControl("esp_settinglanguage") as any; // Need to cast to any to access addCustomFilter
    debugger;
    if (lookup) {
      lookup.addCustomFilter(filter);
    }
  }
  public static toggleDialogSection(executionContext: Xrm.Events.EventContext): void {
    const formContext = executionContext.getFormContext();

    // Retrieve the boolean value from field "esp_showconfirmationdialog".
    const dialogField = formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ShowConfirmationDialog);
    if (!dialogField) {
      return;
    }

    const dialogValue = dialogField.getValue();

    // Retrieve the relevant tab and section
    const targetTab = formContext.ui.tabs.get("general");
    if (!targetTab) {
      return;
    }

    const dialogSection = targetTab.sections.get("confirmation_dialog");
    if (!dialogSection) {
      return;
    }

    // Show section "confirmation_dialog" if boolean is true, hide if false (or null).
    if (dialogValue) {
      dialogSection.setVisible(true);
    } else {
      dialogSection.setVisible(false);
    }
  }

  public static toggleSyncSection(executionContext: Xrm.Events.EventContext): void {
    const formContext = executionContext.getFormContext();

    const syncField = formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ExecutionMode);
    if (!syncField) {
      return;
    }

    const syncValue = syncField.getValue();

    const targetTab = formContext.ui.tabs.get("general");
    if (!targetTab) {
      return;
    }

    // Get both sync and async sections, as one of them must always be visible
    const syncSection = targetTab.sections.get("sync_settings");
    if (!syncSection) {
      return;
    }
    const asyncSection = targetTab.sections.get("async_settings");
    if (!asyncSection) {
      return;
    }

    if (syncValue == 0) {
      syncSection.setVisible(true);
      asyncSection.setVisible(false);
    } else {
      asyncSection.setVisible(true);
      syncSection.setVisible(false);
    }
  }

  public static toggleBoxSection(executionContext: Xrm.Events.EventContext): void {
    const formContext = executionContext.getFormContext();

    const boxField = formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxType);
    if (!boxField) {
      return;
    }

    const boxValue = boxField.getValue();

    const targetTab = formContext.ui.tabs.get("general");
    if (!targetTab) {
      return;
    }

    const defaultBoxSection = targetTab.sections.get("sync_confirmation_box");
    if (!defaultBoxSection) {
      return;
    }
    const redirectBoxSection = targetTab.sections.get("sync_confirmation_redirect");
    if (!redirectBoxSection) {
      return;
    }

    if (boxValue == 0) {
      defaultBoxSection.setVisible(true);
      redirectBoxSection.setVisible(false);
    } else if (boxValue == 1) {
      redirectBoxSection.setVisible(true);
      defaultBoxSection.setVisible(false);
    } else {
      redirectBoxSection.setVisible(false);
      defaultBoxSection.setVisible(false);
    }
  }

  //On load functions
  public static async onLoad(executionContext: Xrm.Events.EventContext): Promise<void> {
    FormLogic.toggleDialogSection(executionContext);
    FormLogic.toggleSyncSection(executionContext);
    FormLogic.toggleBoxSection(executionContext);
    await FormLogic.filterLanguage(executionContext);
  }

  //On change functions
  public static onChange(executionContext: Xrm.Events.EventContext): void {
    FormLogic.toggleDialogSection(executionContext);
    FormLogic.toggleSyncSection(executionContext);
    FormLogic.toggleBoxSection(executionContext);
  }
}

// Logic for Form Onsave
export class OnSaveLogic {
  public static async onSaveDialogSection(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext();

    // 1) Retrieve attribute objects via casts
    const showDialogAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_ShowConfirmationDialog,
    ) as Xrm.Attributes.BooleanAttribute;
    const mainButtonAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_MainButtonSetting,
    ) as Xrm.Attributes.LookupAttribute;
    const languageAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_SettingLanguage,
    ) as Xrm.Attributes.LookupAttribute;

    if (!showDialogAttr || !mainButtonAttr) {
      return; // Attributes not found
    }

    // 2) Get the actual values
    const showDialogValue = showDialogAttr.getValue(); // true/false or null
    const mainButtonValue = mainButtonAttr.getValue(); // Array<Xrm.LookupValue> or null
    const languageValue = languageAttr.getValue();

    // 3) If esp_ShowConfirmationDialog is false, clear the specified fields on the current record
    if (showDialogValue === false) {
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ConfirmationDialogTitle)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ConfirmationDialogText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ConfirmationDialogSubtitle)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ConfirmationDialogCancelLabel)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_ConfirmationDialogConfirmLabel)?.setValue(null);
    }

    // 4) Ensure the lookup has a valid ID before fetching related records
    if (!mainButtonValue || mainButtonValue.length === 0 || !mainButtonValue[0].id) {
      return;
    }
    if (!languageValue || languageValue.length === 0 || !languageValue[0].id) {
      return;
    }

    // 5) Retrieve all related esp_ButtonAdvancedSetting records that match the same esp_MainButtonSetting
    const targetLookupId = mainButtonValue[0].id.replace(/[{}]/g, ""); // remove braces from GUID
    const languageId = languageValue[0].id.replace(/[{}]/g, ""); // remove braces from GUID

    try {
      // 6) Query related records
      const baseHelper = new BaseHelper();
      const result = await baseHelper.getAllButtonAdvancedSettingExceptTheGivenLCID(targetLookupId, languageId);

      console.log("We are here: " + targetLookupId + ", " + languageId, ", " + result);
      if (!result || result.length === 0) {
        return;
      }

      // 7) Build an array of promises for record updates
      //    updateRecord(...) returns a PromiseLike<{ entityType: string; id: string }>
      const updatePromises: Array<Xrm.Async.PromiseLike<{ entityType: string; id: string }>> = [];

      for (const record of result) {
        // Identify the record ID field. Common patterns might be "esp_buttonadvancedsettingid"
        const recordId = record.esp_buttonadvancedsettingid;

        if (!recordId) {
          continue;
        }

        // 8) Build the update object
        let updateData: Record<string, unknown> | null = null;

        // If the current record's ShowConfirmationDialog is false => clear fields on the target record
        if (showDialogValue === false) {
          updateData = {
            esp_showconfirmationdialog: false,
            esp_confirmationdialogtitle: null,
            esp_confirmationdialogtext: null,
            esp_confirmationdialogsubtitle: null,
            esp_confirmationdialogcancellabel: null,
            esp_confirmationdialogconfirmlabel: null,
          };
        }
        // If the current record's ShowConfirmationDialog is true => if any of these fields are empty on the target record, set esp_ModificationNeededFlag to true
        else if (showDialogValue === true) {
          const targetTitle = record.esp_confirmationdialogtitle;
          const targetText = record.esp_confirmationdialogtext;
          const targetSubtitle = record.esp_confirmationdialogsubtitle;
          const targetCancel = record.esp_confirmationdialogcancellabel;
          const targetConfirm = record.esp_confirmationdialogconfirmlabel;

          const anyEmpty = !targetTitle || !targetText || !targetSubtitle || !targetCancel || !targetConfirm;
          if (anyEmpty) {
            updateData = {
              esp_showconfirmationdialog: true,
              esp_modificationneededflag: true,
            };
          }
        }

        if (updateData) {
          const updatePromise = Xrm.WebApi.updateRecord("esp_buttonadvancedsetting", recordId, updateData);
          updatePromises.push(updatePromise);
        }
      }

      // 9) Execute all update operations
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        // Optionally, show a success notification or do further processing
      }
    } catch (error: unknown) {
      console.error("Error in OnSaveLogic for dialog:", error);
    }
  }
  public static async onSaveSyncSections(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext();

    // 1) Retrieve attribute objects via casts
    const showSyncAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_ExecutionMode,
    ) as Xrm.Attributes.OptionSetAttribute;
    const mainButtonAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_MainButtonSetting,
    ) as Xrm.Attributes.LookupAttribute;

    if (!showSyncAttr || !mainButtonAttr) {
      return; // Attributes not found
    }

    // 2) Get the actual values
    const showSyncValue = showSyncAttr.getValue(); // true/false or null
    const mainButtonValue = mainButtonAttr.getValue(); // Array<Xrm.LookupValue> or null

    // 3) Deppending on esp_ExecutionMode, clear the specified fields on the current record
    if (showSyncValue === 0) {
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_AsyncFormNotificationText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_AsyncFormNotification)?.setValue(false);
    } else if (showSyncValue === 1) {
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncFormNotificationText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncFormNotification)?.setValue(false);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncSpinnerText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncSuccessFormNotificationText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxType)?.setValue(null);
    }

    // 4) Ensure the lookup has a valid ID before fetching related records
    if (!mainButtonValue || mainButtonValue.length === 0 || !mainButtonValue[0].id) {
      return;
    }

    // 5) Retrieve all related esp_ButtonAdvancedSetting records that match the same esp_MainButtonSetting
    const targetLookupId = mainButtonValue[0].id.replace(/[{}]/g, ""); // remove braces from GUID

    // Many lookups use a property like "_esp_mainbuttonsetting_value" for the relationship filter
    // You may need quotes around the GUID depending on your environment: eq '${targetLookupId}'
    const filter = `_$esp_mainbuttonsetting_value eq ${targetLookupId}`;

    try {
      // 6) Query related records
      const result = await Xrm.WebApi.retrieveMultipleRecords(
        "esp_buttonadvancedsetting",
        `?$select=esp_AsyncFormNotificationText,esp_SyncFormNotificationText,esp_SyncSpinnerText,esp_SyncSuccessFormNotificationText,esp_SyncConfirmationBoxType,esp_ConfirmationDialogFlag&$filter=${filter}`,
      );

      if (!result || !result.entities || result.entities.length === 0) {
        return;
      }

      // 7) Build an array of promises for record updates
      //    updateRecord(...) returns a PromiseLike<{ entityType: string; id: string }>
      const updatePromises: Array<Xrm.Async.PromiseLike<{ entityType: string; id: string }>> = [];

      for (const record of result.entities) {
        // Identify the record ID field. Common patterns might be "esp_buttonadvancedsettingid"
        const recordId =
          record["esp_buttonadvancedsettingid"] ||
          record["esp_ButtonAdvancedSettingId"] ||
          record["esp_buttonadvancedsettingId"];

        if (!recordId) {
          continue;
        }

        // 8) Build the update object
        let updateData: Record<string, unknown> | null = null;

        // If the current record's ShowConfirmationDialog is false => clear fields on the target record
        if (showSyncValue === 0) {
          updateData = {
            esp_SyncConfirmationBoxType: null,
            esp_SyncFormNotificationText: null,
            esp_SyncFormNotification: false,
            esp_SyncSpinnerText: null,
            esp_SyncSuccessFormNotificationText: null,
          };
          const targetText = record["esp_AsyncFormNotificationText"];

          const anyEmpty = !targetText;
          if (anyEmpty) {
            updateData.esp_ModificationNeededFlag = true;
          }
        }
        // If the current record's ShowConfirmationDialog is true => if any of these fields are empty on the target record, set esp_ModificationNeededFlag to true
        else if (showSyncValue === 1) {
          updateData = {
            esp_AsyncFormNotificationText: null,
            esp_AsyncFormNotification: false,
          };
          const targetType = record["esp_SyncConfirmationBoxType"];
          const targetText = record["esp_SyncFormNotificationText"];
          const spinnerText = record["esp_SyncSpinnerText"];
          const successText = record["esp_SyncSuccessFormNotificationText"];

          const anyEmpty = !targetType || !targetText || !spinnerText || !successText;
          if (anyEmpty) {
            updateData.esp_ModificationNeededFlag = true;
          }
        }

        if (updateData) {
          const updatePromise = Xrm.WebApi.updateRecord("esp_buttonadvancedsetting", recordId, updateData);
          updatePromises.push(updatePromise);
        }
      }

      // 9) Execute all update operations
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        // Optionally, show a success notification or do further processing
      }
    } catch (error: unknown) {
      console.error("Error in OnSaveLogic for sync/async:", error);
    }
  }
  public static async onSaveBoxSections(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext();

    // 1) Retrieve attribute objects via casts
    const boxTypeAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxType,
    ) as Xrm.Attributes.OptionSetAttribute;
    const mainButtonAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_MainButtonSetting,
    ) as Xrm.Attributes.LookupAttribute;

    if (!boxTypeAttr || !mainButtonAttr) {
      return; // Attributes not found
    }

    // 2) Get the actual values
    const boxTypeValue = boxTypeAttr.getValue(); // true/false or null
    const mainButtonValue = mainButtonAttr.getValue(); // Array<Xrm.LookupValue> or null

    // 3) Deppending on esp_ExecutionMode, clear the specified fields on the current record
    if (boxTypeValue === 0) {
      formContext
        .getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxRedirectCancelLabel)
        ?.setValue(null);
      formContext
        .getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxRedirectConfirmLabel)
        ?.setValue(null);
      formContext
        .getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxRedirectSubtitle)
        ?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxRedirectText)?.setValue(null);
      formContext
        .getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxRedirectTitle)
        ?.setValue(null);
    } else if (boxTypeValue === 1) {
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxConfirmLabel)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxText)?.setValue(null);
      formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxTitle)?.setValue(null);
    }

    // 4) Ensure the lookup has a valid ID before fetching related records
    if (!mainButtonValue || mainButtonValue.length === 0 || !mainButtonValue[0].id) {
      return;
    }

    // 5) Retrieve all related esp_ButtonAdvancedSetting records that match the same esp_MainButtonSetting
    const targetLookupId = mainButtonValue[0].id.replace(/[{}]/g, ""); // remove braces from GUID

    // Many lookups use a property like "_esp_mainbuttonsetting_value" for the relationship filter
    // You may need quotes around the GUID depending on your environment: eq '${targetLookupId}'
    const filter = `_$esp_mainbuttonsetting_value eq ${targetLookupId}`;

    try {
      // 6) Query related records
      const result = await Xrm.WebApi.retrieveMultipleRecords(
        "esp_buttonadvancedsetting",
        `?$select=esp_SyncConfirmationBoxTitle,esp_SyncConfirmationBoxText,esp_SyncConfirmationBoxConfirmLabel,esp_SyncConfirmationBoxRedirectTitle,esp_SyncConfirmationBoxRedirectText,esp_SyncConfirmationBoxRedirectSubtitle,esp_SyncConfirmationBoxRedirectCancelLabel,esp_SyncConfirmationBoxRedirectConfirmLabel&$filter=${filter}`,
      );

      if (!result || !result.entities || result.entities.length === 0) {
        return;
      }

      // 7) Build an array of promises for record updates
      //    updateRecord(...) returns a PromiseLike<{ entityType: string; id: string }>
      const updatePromises: Array<Xrm.Async.PromiseLike<{ entityType: string; id: string }>> = [];

      for (const record of result.entities) {
        // Identify the record ID field. Common patterns might be "esp_buttonadvancedsettingid"
        const recordId =
          record["esp_buttonadvancedsettingid"] ||
          record["esp_ButtonAdvancedSettingId"] ||
          record["esp_buttonadvancedsettingId"];

        if (!recordId) {
          continue;
        }

        // 8) Build the update object
        let updateData: Record<string, unknown> | null = null;

        // If the current record's ShowConfirmationDialog is false => clear fields on the target record
        if (boxTypeValue === 0) {
          updateData = {
            esp_SyncConfirmationBoxRedirectCancelLabel: null,
            esp_SyncConfirmationBoxRedirectConfirmLabel: null,
            esp_SyncConfirmationBoxRedirectSubtitle: null,
            esp_SyncConfirmationBoxRedirectText: null,
            esp_SyncConfirmationBoxRedirectTitle: null,
          };
          const CboxTitle = record["esp_SyncConfirmationBoxTitle"];
          const CboxText = record["esp_SyncConfirmationBoxText"];
          const CboxLabel = record["esp_SyncConfirmationBoxConfirmLabel"];

          const anyEmpty = !CboxTitle || !CboxText || !CboxLabel;
          if (anyEmpty) {
            updateData.esp_ModificationNeededFlag = true;
          }
        }
        // If the current record's ShowConfirmationDialog is true => if any of these fields are empty on the target record, set esp_ModificationNeededFlag to true
        else if (boxTypeValue === 1) {
          updateData = {
            esp_SyncConfirmationBoxTitle: null,
            esp_SyncConfirmationBoxText: null,
            esp_SyncConfirmationBoxConfirmLabel: null,
          };
          const cancelLabel = record["esp_SyncConfirmationBoxRedirectCancelLabel"];
          const confirmLabel = record["esp_SyncConfirmationBoxRedirectConfirmLabel"];
          const boxSubtitle = record["esp_SyncConfirmationBoxRedirectSubtitle"];
          const boxText = record["esp_SyncConfirmationBoxRedirectText"];
          const boxTitle = record["esp_SyncConfirmationBoxRedirectTitle"];

          const anyEmpty = !cancelLabel || !confirmLabel || !boxSubtitle || !boxText || !boxTitle;
          if (anyEmpty) {
            updateData.esp_ModificationNeededFlag = true;
          }
        }

        if (updateData) {
          const updatePromise = Xrm.WebApi.updateRecord("esp_buttonadvancedsetting", recordId, updateData);
          updatePromises.push(updatePromise);
        }
      }

      // 9) Execute all update operations
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        // Optionally, show a success notification or do further processing
      }
    } catch (error: unknown) {
      console.error("Error in OnSaveLogic for sync/async:", error);
    }
  }
  //On save functions
  public static onSave(executionContext: Xrm.Events.EventContext): void {
    OnSaveLogic.onSaveDialogSection(executionContext);
    OnSaveLogic.onSaveBoxSections(executionContext);
    OnSaveLogic.onSaveSyncSections(executionContext);
  }
}
