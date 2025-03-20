/* eslint-disable camelcase */
import { esp_ButtonAdvancedSetting } from "./dataverse-gen";
import { ExceptionLowCodeButton } from "./exceptions";

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

  static async openConfirmationDialogBeforeRun(buttonAdvancedSettings: esp_ButtonAdvancedSetting) {
    if (buttonAdvancedSettings.esp_confirmationdialogtext == null) {
      await ExceptionLowCodeButton.showConfirmationDialogError();
      return;
    }
    const confirmStrings: Xrm.Navigation.ConfirmStrings = {
      cancelButtonLabel: buttonAdvancedSettings.esp_confirmationdialogcancellabel ?? "",
      confirmButtonLabel: buttonAdvancedSettings.esp_confirmationdialogconfirmlabel ?? "",
      subtitle: buttonAdvancedSettings.esp_confirmationdialogsubtitle ?? "",
      text: buttonAdvancedSettings.esp_confirmationdialogtext ?? "",
      title: buttonAdvancedSettings.esp_confirmationdialogtitle!,
    };
    const result = await Xrm.Navigation.openConfirmDialog(confirmStrings);
    return result.confirmed;
  }

  static async asyncFormNotification(formContext: Xrm.FormContext, buttonAdvancedSettings: esp_ButtonAdvancedSetting) {
    if (buttonAdvancedSettings.esp_asyncformnotificationtext == null) {
      await ExceptionLowCodeButton.showFormNotificationMissingTextError();
      return;
    }
    formContext.ui.setFormNotification(
      buttonAdvancedSettings.esp_asyncformnotificationtext,
      "INFO",
      "LowCodeButtonAsyncNotification",
    );
    setTimeout(() => {
      formContext.ui.clearFormNotification("LowCodeButtonAsyncNotification");
    }, 5000);
  }
}
