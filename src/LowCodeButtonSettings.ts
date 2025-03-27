/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { esp_buttonsetting_esp_buttonsetting_esp_buttonlocation } from "./dataverse-gen";
import { esp_ButtonSettingAttributes } from "./dataverse-gen/entities/esp_ButtonSetting";

export class ButtonSetting {
  public onLoad(formContext: Xrm.FormContext) {
    const examplePayload = formContext.getControl(esp_ButtonSettingAttributes.esp_ShowExamplePayload) as any; // Needs to be cast to any to access setVisible
    examplePayload.setVisible(formContext.getAttribute(esp_ButtonSettingAttributes.esp_ShowExamplePayload)?.getValue());
  }

  public async onChange(formContext: Xrm.FormContext) {
    const examplePayload = formContext.getControl(esp_ButtonSettingAttributes.esp_ShowExamplePayload) as any; // Needs to be cast to any to access setVisible
    examplePayload.setVisible(formContext.getAttribute(esp_ButtonSettingAttributes.esp_ShowExamplePayload)?.getValue());
    formContext
      .getAttribute(esp_ButtonSettingAttributes.esp_ExamplePayload)
      ?.setValue(this.setFormattedExamplePayload(formContext));
    // Save the form
    await formContext.data.save();
  }

  private setFormattedExamplePayload(formContext: Xrm.FormContext): string {
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
        entityLogicalSingularName: "test",
        entityLogicalPluralName: "tests",
      };
      if (
        formContext.getAttribute(esp_ButtonSettingAttributes.esp_ButtonLocation)?.getValue() ===
        esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid
      ) {
        examplePayload = {
          ...examplePayload,
          parentEntityLogicalName: "test",
          parentEntityLogicalPluralName: "tests",
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
        esp_buttonsetting_esp_buttonsetting_esp_buttonlocation.Subgrid
      ) {
        examplePayload = {
          ...examplePayload,
          recordIds: ["Guid1", "Guid2"],
        };
      }
    }
    return JSON.stringify(examplePayload, null, 2);
  }
}
