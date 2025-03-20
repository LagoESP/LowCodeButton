/* eslint-disable*/
import { esp_buttonadvancedsettingMetadata } from "./entities/esp_ButtonAdvancedSetting";
import { esp_buttonsettingMetadata } from "./entities/esp_ButtonSetting";
import { esp_languageMetadata } from "./entities/esp_Language";

export const Entities = {
  esp_ButtonAdvancedSetting: "esp_buttonadvancedsetting",
  esp_ButtonSetting: "esp_buttonsetting",
  esp_Language: "esp_language",
};

// Setup Metadata
// Usage: setMetadataCache(metadataCache);
export const metadataCache = {
  entities: {
    esp_buttonadvancedsetting: esp_buttonadvancedsettingMetadata,
    esp_buttonsetting: esp_buttonsettingMetadata,
    esp_language: esp_languageMetadata,
  },
  actions: {
  }
};