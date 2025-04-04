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
    const filter = await helper.getFilterLookupForLanguage(mainButtonSettingId, languageId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lookup = formContext.getControl("esp_settinglanguage") as any; // Need to cast to any to access addCustomFilter
    debugger;
    if (lookup) {
      lookup.addPreSearch(() => {
        lookup.addCustomFilter(filter);
      });
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
    const boxType = formContext.getAttribute(esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxType);
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
      boxType?.setValue(null);
      boxType?.fireOnChange();
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
  public static async onSaveFieldUpdates(executionContext: Xrm.Events.EventContext): Promise<void> {
    const formContext = executionContext.getFormContext();

    // 1) Retrieve attribute objects via casts
    const showDialogAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_ShowConfirmationDialog,
    ) as Xrm.Attributes.BooleanAttribute;
    const showSyncAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_ExecutionMode,
    ) as Xrm.Attributes.OptionSetAttribute;
    const boxTypeAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_SyncConfirmationBoxType,
    ) as Xrm.Attributes.OptionSetAttribute;
    const mainButtonAttr = formContext.getAttribute(
      esp_ButtonAdvancedSettingAttributes.esp_MainButtonSetting,
    ) as Xrm.Attributes.LookupAttribute;

    if (!showDialogAttr || !boxTypeAttr || !showSyncAttr || !mainButtonAttr) {
      return; // Attributes not found
    }

    // 2) Get the actual values
    const showDialogValue = showDialogAttr.getValue();
    const showSyncValue = showSyncAttr.getValue();
    const boxTypeValue = boxTypeAttr.getValue();
    const mainButtonValue = mainButtonAttr.getValue(); // Array<Xrm.LookupValue> or null

    // 4) Ensure the lookup has a valid ID before fetching related records
    if (!mainButtonValue || mainButtonValue.length === 0 || !mainButtonValue[0].id) {
      return;
    }

    const targetLookupId = mainButtonValue[0].id.replace(/[{}]/g, ""); // remove braces from GUID
    const currentRecordId = formContext.data.entity.getId().replace(/[{}]/g, "");

    // 5) Retrieve all esp_ButtonAdvancedSetting records that match the same esp_MainButtonSetting
    try {
      const baseHelper = new BaseHelper();
      const result = await baseHelper.getAllButtonAdvancedSetting(targetLookupId);

      if (!result || result.length === 0) {
        return;
      }

      // 6) Build an array of promises for record updates
      //    updateRecord(...) returns a PromiseLike<{ entityType: string; id: string }>
      const updatePromises: Array<Xrm.Async.PromiseLike<{ entityType: string; id: string }>> = [];

      for (const record of result) {
        const recordId = record.esp_buttonadvancedsettingid;

        if (!recordId) {
          continue;
        }

        // 7) Build the update object
        let updateData: Record<string, unknown> = {};

        // Modification needed flag tracker
        var needsFlag = false;

        // DIALOG LOGIC
        // If the current record's ShowConfirmationDialog is false => clear fields on the target record
        if (showDialogValue === false) {
          updateData.esp_showconfirmationdialog = false;
          updateData.esp_confirmationdialogtitle = null;
          updateData.esp_confirmationdialogtext = null;
          updateData.esp_confirmationdialogsubtitle = null;
          updateData.esp_confirmationdialogcancellabel = null;
          updateData.esp_confirmationdialogconfirmlabel = null;
        }
        // If the current record's ShowConfirmationDialog is true => if any of these fields are empty on the target record, set esp_ModificationNeededFlag to true
        else if (showDialogValue === true) {
          updateData.esp_showconfirmationdialog = true;

          const targetTitle = record.esp_confirmationdialogtitle;
          const targetText = record.esp_confirmationdialogtext;
          const targetSubtitle = record.esp_confirmationdialogsubtitle;
          const targetCancel = record.esp_confirmationdialogcancellabel;
          const targetConfirm = record.esp_confirmationdialogconfirmlabel;

          const anyEmpty = !targetTitle || !targetText || !targetSubtitle || !targetCancel || !targetConfirm;
          if (anyEmpty) {
            needsFlag = true;
          }
        }

        // SYNC/ASYNC LOGIC
        if (showSyncValue === 1) {
          updateData.esp_executionmode = 1;
          updateData.esp_syncconfirmationboxtype = null;
          updateData.esp_syncformnotificationtext = null;
          updateData.esp_syncformnotification = false;
          updateData.esp_syncspinnertext = null;
          updateData.esp_syncsuccessformnotificationtext = null;
          updateData.esp_syncconfirmationboxtitle = null;
          updateData.esp_syncconfirmationboxtext = null;
          updateData.esp_syncconfirmationboxconfirmlabel = null;
          updateData.esp_syncconfirmationboxredirectcancellabel = null;
          updateData.esp_syncconfirmationboxredirectconfirmlabel = null;
          updateData.esp_syncconfirmationboxredirectsubtitle = null;
          updateData.esp_syncconfirmationboxredirecttext = null;
          updateData.esp_syncconfirmationboxredirecttitle = null;

          const targetText = record.esp_AsyncFormNotificationText;

          const anyEmpty = !targetText;
          if (anyEmpty) {
            needsFlag = true;
          }
        } else if (showSyncValue === 0) {
          updateData.esp_executionmode = 0;
          updateData.esp_asyncformnotificationtext = null;
          updateData.esp_asyncformnotification = false;

          const targetType = record.esp_SyncConfirmationBoxType;
          const targetText = record.esp_SyncFormNotificationText;
          const spinnerText = record.esp_SyncSpinnerText;
          const successText = record.esp_SyncSuccessFormNotificationText;

          const anyEmpty = !targetType || !targetText || !spinnerText || !successText;
          if (anyEmpty) {
            needsFlag = true;
          }
        }

        // CONFIRMATION BOX LOGIC
        if (boxTypeValue === 0) {
          updateData.esp_syncconfirmationboxtype = 0;
          updateData.esp_syncconfirmationboxredirectcancellabel = null;
          updateData.esp_syncconfirmationboxredirectconfirmlabel = null;
          updateData.esp_syncconfirmationboxredirectsubtitle = null;
          updateData.esp_syncconfirmationboxredirecttext = null;
          updateData.esp_syncconfirmationboxredirecttitle = null;

          const CboxTitle = record.esp_SyncConfirmationBoxTitle;
          const CboxText = record.esp_SyncConfirmationBoxText;
          const CboxLabel = record.esp_SyncConfirmationBoxConfirmLabel;

          const anyEmpty = !CboxTitle || !CboxText || !CboxLabel;
          if (anyEmpty) {
            needsFlag = true;
          }
        } else if (boxTypeValue === 1) {
          updateData.esp_syncconfirmationboxtype = 1;
          updateData.esp_syncconfirmationboxtitle = null;
          updateData.esp_syncconfirmationboxtext = null;
          updateData.esp_syncconfirmationboxconfirmlabel = null;

          const cancelLabel = record.esp_SyncConfirmationBoxRedirectCancelLabel;
          const confirmLabel = record.esp_SyncConfirmationBoxRedirectConfirmLabel;
          const boxSubtitle = record.esp_SyncConfirmationBoxRedirectSubtitle;
          const boxText = record.esp_SyncConfirmationBoxRedirectText;
          const boxTitle = record.esp_SyncConfirmationBoxRedirectTitle;

          const anyEmpty = !cancelLabel || !confirmLabel || !boxSubtitle || !boxText || !boxTitle;
          if (anyEmpty) {
            needsFlag = true;
          }
        }

        // Flag record or not
        if (!needsFlag || recordId.toLowerCase() == currentRecordId.toLowerCase()) {
          updateData.esp_modificationneededflag = false;
        } else {
          updateData.esp_modificationneededflag = true;
        }

        if (updateData) {
          const updatePromise = Xrm.WebApi.updateRecord("esp_buttonadvancedsetting", recordId, updateData);
          updatePromises.push(updatePromise);
        }
      }

      // 8) Execute all update operations
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        formContext.data.refresh(true);
      }
    } catch (error: unknown) {
      console.error("Error in OnSaveLogic: ", error);
    }
  }

  //On save functions
  public static onSave(executionContext: Xrm.Events.EventContext): void {
    OnSaveLogic.onSaveFieldUpdates(executionContext);
  }
}
