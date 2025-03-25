/// <reference types="xrm" />

// Logic for form Onload and Onchange
export class FormLogic {
  public static toggleDialogSection(executionContext: Xrm.Events.EventContext): void {
    const formContext = executionContext.getFormContext();

    // Retrieve the boolean value from field "esp_showconfirmationdialog".
    const dialogField = formContext.getAttribute("esp_showconfirmationdialog");
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

    const syncField = formContext.getAttribute("esp_executionmode");
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

    const boxField = formContext.getAttribute("esp_syncconfirmationboxtype");
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
  } if (boxValue == 1) {
      redirectBoxSection.setVisible(true);
      defaultBoxSection.setVisible(false);
  } else {
      redirectBoxSection.setVisible(false);
      defaultBoxSection.setVisible(false);
  }
  }

  //On load functions
  public static onFormLoad(executionContext: Xrm.Events.EventContext): void {
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
  public static async onSaveDialogSection(executionContext: Xrm.Events.EventContext): Promise<void> {
      const formContext = executionContext.getFormContext();

      // 1) Retrieve attribute objects via casts
      const showDialogAttr = formContext.getAttribute("esp_ShowConfirmationDialog") as Xrm.Attributes.BooleanAttribute;
      const mainButtonAttr = formContext.getAttribute("esp_MainButtonSetting") as Xrm.Attributes.LookupAttribute;

      if (!showDialogAttr || !mainButtonAttr) {
          return; // Attributes not found
      }

      // 2) Get the actual values
      const showDialogValue = showDialogAttr.getValue();   // true/false or null
      const mainButtonValue = mainButtonAttr.getValue();   // Array<Xrm.LookupValue> or null

      // 3) If esp_ShowConfirmationDialog is false, clear the specified fields on the current record
      if (showDialogValue === false) {
          formContext.getAttribute("esp_ConfirmationDialogTitle")?.setValue(null);
          formContext.getAttribute("esp_ConfirmationDialogText")?.setValue(null);
          formContext.getAttribute("esp_ConfirmationDialogSubtitle")?.setValue(null);
          formContext.getAttribute("esp_ConfirmationDialogCancelLabel")?.setValue(null);
          formContext.getAttribute("esp_ConfirmationDialogConfirmLabel")?.setValue(null);
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
              `?$select=esp_ConfirmationDialogTitle,esp_ConfirmationDialogText,esp_ConfirmationDialogSubtitle,esp_ConfirmationDialogCancelLabel,esp_ConfirmationDialogConfirmLabel,esp_ShowConfirmationDialog,esp_ConfirmationDialogFlag&$filter=${filter}`
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
              let updateData: Record<string, any> | null = null;

              // If the current record's ShowConfirmationDialog is false => clear fields on the target record
              if (showDialogValue === false) {
                  updateData = {
                      esp_ConfirmationDialogTitle: null,
                      esp_ConfirmationDialogText: null,
                      esp_ConfirmationDialogSubtitle: null,
                      esp_ConfirmationDialogCancelLabel: null,
                      esp_ConfirmationDialogConfirmLabel: null
                  };
              }
              // If the current record's ShowConfirmationDialog is true => if any of these fields are empty on the target record, set esp_ModificationNeededFlag to true
              else if (showDialogValue === true) {
                  const targetTitle = record["esp_ConfirmationDialogTitle"];
                  const targetText = record["esp_ConfirmationDialogText"];
                  const targetSubtitle = record["esp_ConfirmationDialogSubtitle"];
                  const targetCancel = record["esp_ConfirmationDialogCancelLabel"];
                  const targetConfirm = record["esp_ConfirmationDialogConfirmLabel"];

                  const anyEmpty = !targetTitle || !targetText || !targetSubtitle || !targetCancel || !targetConfirm;
                  if (anyEmpty) {

                      updateData = {
                        esp_ModificationNeededFlag: true
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
      } catch (error: any) {
          console.error("Error in OnSaveLogic.handleOnSave:", error);
      }
  }
}