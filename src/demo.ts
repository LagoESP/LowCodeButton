import { esp_LanguageAttributes as Language} from "./dataverse-gen/entities/esp_Language";
import { esp_languageMetadata as LanguageMetadata } from "./dataverse-gen/entities/esp_Language";
import { esp_ButtonSettingsAttributes as ButtonSettings } from "./dataverse-gen/entities/esp_ButtonSettings";
import { esp_buttonsettingsMetadata as ButtonSettingsMetadata } from "./dataverse-gen/entities/esp_ButtonSettings";
import { esp_ButtonAdvancedSettingAttributes as ButtonAdvancedSetting, esp_ButtonAdvancedSettingAttributes } from "./dataverse-gen/entities/esp_ButtonAdvancedSetting";
import { esp_buttonadvancedsettingMetadata as ButtonAdvancedSettingMetadata } from "./dataverse-gen/entities/esp_ButtonAdvancedSetting";

export class LCB {
    async onClick(context: Xrm.Events.EventContext, buttonSettingName: String): Promise<void> {
        console.log("Button Clicked");
        console.log("Button Setting Name: " + buttonSettingName);
    }
}