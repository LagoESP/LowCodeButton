/* eslint-disable camelcase */
import {
  esp_ButtonAdvancedSetting,
  esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode,
  esp_ButtonSetting,
} from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./exceptions";
import { RedirectResponse } from "./models";

export class Helper {
  static getLanguageCode(): number {
    return Xrm.Utility.getGlobalContext().userSettings.languageId;
  }

  static getUserID(): string {
    return Xrm.Utility.getGlobalContext().userSettings.userId.replace("{", "").replace("}", "").toLowerCase();
  }

  static getEntityLogicalName(formContext: Xrm.FormContext): string {
    return formContext.data.entity.getEntityName();
  }

  static getRecordId(formContext: Xrm.FormContext): string {
    return formContext.data.entity.getId().replace("{", "").replace("}", "").toLowerCase();
  }

  static async getButtonSetting(buttonSettingName: string): Promise<unknown> {
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
    const url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/esp_buttonsettings" + query;
    const response = await Helper.makeRequest("GET", url);
    const data = await response.json();
    return data.value[0];
  }

  static async getButtonAdvancedSetting(mainButtonSettingId: string, lcid: number): Promise<unknown> {
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
    const url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/esp_buttonadvancedsettings" + query;
    const response = await Helper.makeRequest("GET", url);
    const data = await response.json();
    return data.value[0];
  }

  static getPayload(formContext: Xrm.FormContext, buttonSetting: esp_ButtonSetting): Record<string, unknown> {
    let payload = {};
    if (buttonSetting.esp_includeentitylogicalnameinpayload) {
      payload = { ...payload, entityLogicalName: Helper.getEntityLogicalName(formContext) };
    }
    if (buttonSetting.esp_includerecordidinpayload) {
      payload = { ...payload, recordId: Helper.getRecordId(formContext) };
    }
    if (buttonSetting.esp_includecallinguserinpayload) {
      payload = { ...payload, userId: Helper.getUserID() };
    }
    return payload;
  }
  static async makeRequest(method: string, url: string, body?: unknown): Promise<Response> {
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

  static async openConfirmationDialogBeforeRun(buttonAdvancedSetting: esp_ButtonAdvancedSetting): Promise<boolean> {
    if (buttonAdvancedSetting.esp_confirmationdialogtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Confirmation Dialog Text Error",
        "The confirmation dialog text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: buttonAdvancedSetting.esp_confirmationdialogcancellabel ?? "",
      confirmButtonLabel: buttonAdvancedSetting.esp_confirmationdialogconfirmlabel ?? "",
      subtitle: buttonAdvancedSetting.esp_confirmationdialogsubtitle ?? "",
      text: buttonAdvancedSetting.esp_confirmationdialogtext ?? "",
      title: buttonAdvancedSetting.esp_confirmationdialogtitle!,
    };
    const result = await Xrm.Navigation.openConfirmDialog(confirmStrings);
    return result.confirmed;
  }

  static async openSuccessDialogSync(buttonAdvancedSetting: esp_ButtonAdvancedSetting): Promise<boolean> {
    if (buttonAdvancedSetting.esp_syncconfirmationboxtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Text Error",
        "The sync confirmation box text is empty! Please fill it on your configuration settings.",
      );
      return false;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      confirmButtonLabel: buttonAdvancedSetting.esp_syncconfirmationboxconfirmlabel ?? undefined,
      text: buttonAdvancedSetting.esp_syncconfirmationboxtext ?? undefined,
      title: buttonAdvancedSetting.esp_syncconfirmationboxtitle!,
    };
    const result = await Xrm.Navigation.openAlertDialog(confirmStrings);
    return result.confirmed;
  }

  static async openSuccessDialogRedirect(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
    response: RedirectResponse,
  ) {
    if (buttonAdvancedSetting.esp_syncconfirmationboxredirecttext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Confirmation Box Redirect Text Error",
        "The sync confirmation box redirect text is empty! Please fill it on your configuration settings.",
      );
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: buttonAdvancedSetting.esp_syncconfirmationboxredirectcancellabel ?? undefined,
      confirmButtonLabel: buttonAdvancedSetting.esp_syncconfirmationboxredirectconfirmlabel ?? undefined,
      text: buttonAdvancedSetting.esp_syncconfirmationboxredirecttext!,
      subtitle: buttonAdvancedSetting.esp_syncconfirmationboxredirectsubtitle ?? undefined,
      title: buttonAdvancedSetting.esp_syncconfirmationboxredirecttitle ?? undefined,
    };
    Xrm.Navigation.openConfirmDialog(confirmStrings).then((result) => {
      if (result.confirmed) {
        console.log("User confirmed the dialog, redirecting...");
        if (
          buttonAdvancedSetting.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
        ) {
          window.open(response.redirectUri, "_self")!.focus();
        } else {
          window.open(response.redirectUri, "_blank")!.focus();
        }
      } else {
        console.log("User cancelled the dialog, checking if we should refresh the form");
        this.reloadForm(formContext, buttonSetting, buttonAdvancedSetting);
      }
    });
  }

  static reloadForm(
    formContext: Xrm.FormContext,
    buttonSetting: esp_ButtonSetting,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    if (
      buttonSetting.esp_refreshformwhenapicallends &&
      !(
        buttonAdvancedSetting.esp_syncconfirmationboxredirect &&
        buttonAdvancedSetting.esp_syncconfirmationboxredirectmode ===
          esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode.CurrentTab
      )
    ) {
      formContext.data.refresh(false);
    }
  }

  static async asyncFormNotification(formContext: Xrm.FormContext, buttonAdvancedSetting: esp_ButtonAdvancedSetting) {
    if (buttonAdvancedSetting.esp_asyncformnotificationtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Async Form Notification Text Error",
        "The async form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    formContext.ui.setFormNotification(
      buttonAdvancedSetting.esp_asyncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  static async clearFormNotification(formContext: Xrm.FormContext) {
    formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
  }

  static async syncFormNotification(formContext: Xrm.FormContext, buttonAdvancedSetting: esp_ButtonAdvancedSetting) {
    if (buttonAdvancedSetting.esp_syncformnotificationtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Sync Form Notification Text Error",
        "The sync form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    formContext.ui.setFormNotification(
      buttonAdvancedSetting.esp_syncformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 120000);
  }

  static async showSuccessFormNotification(
    formContext: Xrm.FormContext,
    buttonAdvancedSetting: esp_ButtonAdvancedSetting,
  ) {
    if (buttonAdvancedSetting.esp_syncsuccessformnotificationtext == null) {
      await ExceptionLowCodeButton.showFormNotificationGenericError(
        "Success Form Notification Text Error",
        "The success form notification text is empty! Please fill it on your configuration settings.",
      );
      return;
    }
    formContext.ui.setFormNotification(
      buttonAdvancedSetting.esp_syncsuccessformnotificationtext,
      "INFO",
      "LowCodeButtonFormNotification",
    );
    setTimeout(() => {
      formContext.ui.clearFormNotification("LowCodeButtonFormNotification");
    }, 5000);
  }

  static clearSyncNotifications(formContext: Xrm.FormContext, buttonAdvancedSetting: esp_ButtonAdvancedSetting) {
    if (buttonAdvancedSetting.esp_syncformnotification) {
      Helper.clearFormNotification(formContext);
    }
    if (buttonAdvancedSetting.esp_syncspinner) {
      Xrm.Utility.closeProgressIndicator();
    }
  }
}
