/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode,
  esp_ButtonSetting,
} from "../dataverse-gen";
import { ExceptionLowCodeButton } from "../Exceptions/BaseButtonException";
import { RedirectResponse } from "../Models/BaseButtonResponseModels";

export class ButtonHelper {
  formContext?: Xrm.FormContext;
  buttonSetting?: esp_ButtonSetting;
  buttonAdvancedSetting?: esp_ButtonAdvancedSetting;

  constructor(
    formContext?: Xrm.FormContext,
    buttonSetting?: esp_ButtonSetting,
    buttonAdvancedSetting?: esp_ButtonAdvancedSetting,
  ) {
    this.formContext = formContext;
    this.buttonSetting = buttonSetting;
    this.buttonAdvancedSetting = buttonAdvancedSetting;
  }

  // Setter methods allow properties to be defined later
  setFormContext(formContext: Xrm.FormContext) {
    this.formContext = formContext;
  }

  setButtonSetting(buttonSetting: esp_ButtonSetting) {
    this.buttonSetting = buttonSetting;
  }

  setButtonAdvancedSetting(buttonAdvancedSetting: esp_ButtonAdvancedSetting) {
    this.buttonAdvancedSetting = buttonAdvancedSetting;
  }

  getLanguageCode(): number {
    return Xrm.Utility.getGlobalContext().userSettings.languageId;
  }

  getUserID(): string {
    return Xrm.Utility.getGlobalContext().userSettings.userId.replace("{", "").replace("}", "").toLowerCase();
  }

  getEntityLogicalName(): string {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    return this.formContext.data.entity.getEntityName();
  }

  getRecordId(): string {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    return this.formContext.data.entity.getId().replace("{", "").replace("}", "").toLowerCase();
  }

  async getButtonSetting(buttonSettingName: string): Promise<esp_ButtonSetting | null> {
    const fetchXml = `
      <fetch top="1">
        <entity name="esp_buttonsetting">
          <attribute name="esp_buttonsettingid" />
          <attribute name="esp_endpoint" />
          <attribute name="esp_includecallinguseridinpayload" />
          <attribute name="esp_includeentitylogicalnameinpayload" />
          <attribute name="esp_includerecordidinpayload" />
          <attribute name="esp_buttonname" />
          <attribute name="esp_savebeforerunning" />
          <attribute name="esp_refreshformwhenapicallends" />
          <filter type="and">
            <condition attribute="esp_buttonname" operator="eq" value="${buttonSettingName}" />
          </filter>
        </entity>
      </fetch>
    `;
    const query = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.1/esp_buttonsettings${query}`;

    try {
      const response = await this.makeRequest("GET", url);
      const data = await response.json();
      const setting = data.value[0] as esp_ButtonSetting;
      this.buttonSetting = setting;
      return setting;
    } catch (error) {
      console.error("Error fetching button setting:", error);
      return null;
    }
  }

  async getButtonAdvancedSetting(mainButtonSettingId: string, lcid: number): Promise<esp_ButtonAdvancedSetting | null> {
    const fetchXml = `
      <fetch top="1">
        <entity name="esp_buttonadvancedsetting">
          <attribute name="esp_asyncformnotification" />
          <attribute name="esp_asyncformnotificationtext" />
          <attribute name="esp_buttonadvancedsettingid" />
          <attribute name="esp_confirmationdialogcancellabel" />
          <attribute name="esp_confirmationdialogconfirmlabel" />
          <attribute name="esp_confirmationdialogsubtitle" />
          <attribute name="esp_confirmationdialogtext" />
          <attribute name="esp_confirmationdialogtitle" />
          <attribute name="esp_executionmode" />
          <attribute name="esp_mainbuttonsetting" />
          <attribute name="esp_settingid" />
          <attribute name="esp_settinglanguage" />
          <attribute name="esp_showconfirmationdialog" />
          <attribute name="esp_syncconfirmationbox" />
          <attribute name="esp_syncconfirmationboxconfirmlabel" />
          <attribute name="esp_syncconfirmationboxredirect" />
          <attribute name="esp_syncconfirmationboxredirectcancellabel" />
          <attribute name="esp_syncconfirmationboxredirectconfirmlabel" />
          <attribute name="esp_syncconfirmationboxredirectmode" />
          <attribute name="esp_syncconfirmationboxredirectsubtitle" />
          <attribute name="esp_syncconfirmationboxredirecttext" />
          <attribute name="esp_syncconfirmationboxredirecttitle" />
          <attribute name="esp_syncconfirmationboxtext" />
          <attribute name="esp_syncconfirmationboxtitle" />
          <attribute name="esp_syncformnotification" />
          <attribute name="esp_syncformnotificationtext" />
          <attribute name="esp_syncrefreshform" />
          <attribute name="esp_syncspinner" />
          <attribute name="esp_syncspinnertext" />
          <attribute name="esp_syncsuccessformnotification" />
          <attribute name="esp_syncsuccessformnotificationtext" />
          <filter>
            <condition attribute="esp_mainbuttonsetting" operator="eq" value="${mainButtonSettingId}" />
          </filter>
          <link-entity name="esp_language" from="esp_languageid" to="esp_settinglanguage" link-type="inner">
            <filter>
              <condition attribute="esp_lcid" operator="eq" value="${lcid}" />
            </filter>
          </link-entity>
        </entity>
      </fetch>
    `;
    const query = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const url = `${Xrm.Utility.getGlobalContext().getClientUrl()}/api/data/v9.1/esp_buttonadvancedsettings${query}`;

    try {
      const response = await this.makeRequest("GET", url);
      const data = await response.json();
      const advancedSetting = data.value[0] as esp_ButtonAdvancedSetting;
      this.buttonAdvancedSetting = advancedSetting;
      return advancedSetting;
    } catch (error) {
      console.error("Error fetching button advanced setting:", error);
      return null;
    }
  }

  getPayload(): Record<string, unknown> {
    if (!this.formContext || !this.buttonSetting) {
      throw new Error("Form context or button setting is not set.");
    }
    let payload: Record<string, unknown> = {};
    if (this.buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: this.getEntityLogicalName() };
    }
    if (this.buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordId: this.getRecordId() };
    }
    if (this.buttonSetting.esp_includecallinguseridinpayload) {
      payload = { ...payload, userId: this.getUserID() };
    }
    return payload;
  }

  async makeRequest(method: string, url: string, body?: unknown): Promise<Response> {
    const headers = {
      "Content-Type": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Accept: "application/json",
      Prefer: "odata.include-annotations=*",
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    return fetch(url, options);
  }

  async openConfirmationDialogBeforeRun(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_confirmationdialogtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Confirmation Dialog Text Error",
        "The confirmation dialog text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: this.buttonAdvancedSetting.esp_confirmationdialogcancellabel ?? "",
      confirmButtonLabel: this.buttonAdvancedSetting.esp_confirmationdialogconfirmlabel ?? "",
      subtitle: this.buttonAdvancedSetting.esp_confirmationdialogsubtitle ?? "",
      text: this.buttonAdvancedSetting.esp_confirmationdialogtext ?? "",
      title: this.buttonAdvancedSetting.esp_confirmationdialogtitle!,
    };
    const result = await Xrm.Navigation.openConfirmDialog(confirmStrings);
    return result.confirmed;
  }

  async openSuccessDialogSync(): Promise<boolean> {
    if (!this.buttonAdvancedSetting || this.buttonAdvancedSetting.esp_syncconfirmationboxtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Text Error",
        "The sync confirmation box text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      confirmButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxconfirmlabel ?? undefined,
      text: this.buttonAdvancedSetting.esp_syncconfirmationboxtext ?? undefined,
      title: this.buttonAdvancedSetting.esp_syncconfirmationboxtitle!,
    };
    const result = await Xrm.Navigation.openAlertDialog(confirmStrings);
    return result.confirmed;
  }

  openSuccessDialogRedirect(response: RedirectResponse): void {
    if (!this.buttonAdvancedSetting) {
      throw new Error("Button advanced setting is not set.");
    }
    if (this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext == null) {
      ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Redirect Text Error",
        "The sync confirmation box redirect text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectcancellabel ?? undefined,
      confirmButtonLabel: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectconfirmlabel ?? undefined,
      text: this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext!,
      subtitle: this.buttonAdvancedSetting.esp_syncconfirmationboxredirectsubtitle ?? undefined,
      title: this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttitle ?? undefined,
    };
    Xrm.Navigation.openConfirmDialog(confirmStrings).then((result) => {
      if (result.confirmed) {
        console.log("User confirmed the dialog, redirecting...");
        if (
          this.buttonAdvancedSetting!.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
        ) {
          window.open(response.redirectUri, "_self")!.focus();
        } else {
          window.open(response.redirectUri, "_blank")!.focus();
        }
      } else {
        console.log("User cancelled the dialog, refreshing the form.");
        this.reloadForm();
      }
    });
  }

  reloadForm(): void {
    if (!this.formContext || !this.buttonSetting || !this.buttonAdvancedSetting) {
      throw new Error("Required properties are not set for reloading the form.");
    }
    if (
      this.buttonSetting.esp_refreshformwhenapicallends &&
      !(
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirect &&
        this.buttonAdvancedSetting.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
      )
    ) {
      this.formContext.data.refresh(false);
    }
  }

  async asyncFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_asyncformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Async Form Notification Text Error",
        "The async form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_asyncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  clearFormNotification(): void {
    if (!this.formContext) {
      throw new Error("Form context is not set.");
    }
    this.formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
  }

  async syncFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_syncformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Form Notification Text Error",
        "The sync form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_syncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 120000);
  }

  async showSuccessFormNotification(): Promise<void> {
    if (
      !this.formContext ||
      !this.buttonAdvancedSetting ||
      this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext == null
    ) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Success Form Notification Text Error",
        "The success form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    this.formContext.ui.setFormNotification(
      this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      this.formContext!.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  clearSyncNotifications(): void {
    if (this.buttonAdvancedSetting?.esp_syncformnotification) {
      this.clearFormNotification();
    }
    if (this.buttonAdvancedSetting?.esp_syncspinner) {
      Xrm.Utility.closeProgressIndicator();
    }
  }
}
