/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { esp_buttonsetting_esp_buttonsetting_esp_buttonlocation } from "./dataverse-gen";
import { esp_ButtonSettingAttributes } from "./dataverse-gen/entities/esp_ButtonSetting";
import { BaseHelper } from "./Helpers/BaseHelper";

export class ButtonSetting {
  public static async onLoad(executionContext: Xrm.Events.EventContext) {
    const formContext = executionContext?.getFormContext() as Xrm.FormContext;
    await this.checkAdvancedButtonSettings(executionContext);
    const examplePayload = formContext.getControl(esp_ButtonSettingAttributes.esp_ExamplePayload) as any; // Needs to be cast to any to access setVisible
    examplePayload.setVisible(formContext.getAttribute(esp_ButtonSettingAttributes.esp_ShowExamplePayload)?.getValue());
  }

  public static async onChange(executionContext: Xrm.Events.EventContext) {
    const formContext = executionContext?.getFormContext() as Xrm.FormContext;
    const examplePayload = formContext.getControl(esp_ButtonSettingAttributes.esp_ExamplePayload) as any; // Needs to be cast to any to access setVisible
    examplePayload.setVisible(formContext.getAttribute(esp_ButtonSettingAttributes.esp_ShowExamplePayload)?.getValue());
    if (formContext.getAttribute(esp_ButtonSettingAttributes.esp_ShowExamplePayload)?.getValue()) {
      formContext
        .getAttribute(esp_ButtonSettingAttributes.esp_ExamplePayload)
        ?.setValue(this.getFormattedExamplePayload(formContext));
      if (formContext.data.getIsDirty() && formContext.ui.getFormType() === XrmEnum.FormType.Update) {
        await formContext.data.save();
      }
    }
  }

  public static async checkAdvancedButtonSettings(executionContext: Xrm.Events.EventContext) {
    const formContext = executionContext?.getFormContext() as Xrm.FormContext;
    const helper = new BaseHelper();
    const currentRecord = formContext.data.entity.getEntityReference();
    const buttonSettings = await helper.getAllButtonAdvancedSetting(currentRecord.id);
    let anyRecordFlagged = false;
    debugger;
    buttonSettings.forEach((buttonSetting) => {
      if (buttonSetting.esp_modificationneededflag) {
        anyRecordFlagged = true;
      }
    });
    if (anyRecordFlagged) {
      formContext.ui.setFormNotification(
        "Some of the advanced button settings need to be properly configured. Please review the records using the 'Advanced Button Settings with Errors' subgrid.",
        XrmEnum.FormNotificationLevel.Warning,
        "ModificationNeeded",
      );
    }
    (formContext.getControl("advanced_settings_error") as unknown as Xrm.Controls.UiStandardElement).setVisible(
      anyRecordFlagged,
    );
  }

  private static getFormattedExamplePayload(formContext: Xrm.FormContext): string {
    let examplePayload: Record<string, unknown> = {};
    if (formContext.getAttribute(esp_ButtonSettingAttributes.esp_IncludeCallingUserIDinPayload)?.getValue()) {
      examplePayload = {
        ...examplePayload,
        userId: "UserId",
      };
    }
    if (formContext.getAttribute(esp_ButtonSettingAttributes.esp_IncludeEntityLogicalNameinPayload)?.getValue()) {
      examplePayload = {
        ...examplePayload,
        entityLogicalSingularName: "account",
        entityLogicalPluralName: "accounts",
      };
      if (
        formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
        esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid
      ) {
        examplePayload = {
          ...examplePayload,
          parentEntityLogicalName: "contact",
          parentEntityLogicalPluralName: "contacts",
        };
      }
    }
    if (formContext.getAttribute(esp_ButtonSettingAttributes.esp_IncludeRecordIDinPayload)?.getValue()) {
      if (
        formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
        esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Form
      ) {
        examplePayload = {
          ...examplePayload,
          recordId: "Guid",
        };
      }
      if (
        formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
          esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Grid ||
        formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
          esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid
      ) {
        examplePayload = {
          ...examplePayload,
          recordIds: ["Guid1", "Guid2"],
        };
        if (
          formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
          esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid
        ) {
          examplePayload = {
            ...examplePayload,
            parentRecordId: "Guid",
          };
        }
      }
    }
    return JSON.stringify(examplePayload, null, 2);
  }
}
