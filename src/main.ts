/* eslint-disable camelcase */
import { esp_LanguageAttributes } from "./dataverse-gen";

export class ButtonRegistration {
  static async onClick(formContext: Xrm.FormContext, buttonSettingName: string) {
    console.log(buttonSettingName);
    console.log("Button clicked");
    console.log(esp_LanguageAttributes.esp_BCP47Code);
  }
}
