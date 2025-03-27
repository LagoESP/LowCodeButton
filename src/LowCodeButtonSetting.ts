/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { esp_buttonsetting_esp_buttonsetting_esp_buttonlocation } from "./dataverse-gen";
import { esp_ButtonSettingAttributes } from "./dataverse-gen/entities/esp_ButtonSetting";

export class ButtonSetting {
  public static onLoad(executionContext: Xrm.Events.EventContext) {
    const formContext = executionContext?.getFormContext() as Xrm.FormContext;
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
