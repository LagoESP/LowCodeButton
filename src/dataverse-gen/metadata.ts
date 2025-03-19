/* eslint-disable*/
import { esp_buttonadvancedsettingMetadata } from "./entities/esp_ButtonAdvancedSetting";
import { esp_buttonsettingsMetadata } from "./entities/esp_ButtonSettings";
import { esp_languageMetadata } from "./entities/esp_Language";

export const Entities = {
  esp_ButtonAdvancedSetting: "esp_buttonadvancedsetting",
  esp_ButtonSettings: "esp_buttonsettings",
  esp_Language: "esp_language",
};

// Setup Metadata
// Usage: setMetadataCache(metadataCache);
export const metadataCache = {
  entities: {
    esp_buttonadvancedsetting: esp_buttonadvancedsettingMetadata,
    esp_buttonsettings: esp_buttonsettingsMetadata,
    esp_language: esp_languageMetadata,
  },
  actions: {
  }
};