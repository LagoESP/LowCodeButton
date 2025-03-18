/* eslint-disable camelcase */
import { esp_LanguageAttributes } from "./dataverse-gen";

export class ButtonRegistration {
  static async onClick(executionContext: Xrm.FormContext, buttonSettingName: string) {
    console.log(executionContext);
    console.log(buttonSettingName);
    console.log("Button clicked");
    console.log(esp_LanguageAttributes.esp_LCID);
  }
}
