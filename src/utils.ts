export class Utils {
  static getLanguageCode(): number {
    return Xrm.Utility.getGlobalContext().userSettings.languageId;
  }

  static getUserID(): string {
    return Xrm.Utility.getGlobalContext().userSettings.userId;
  }

  static getEntityLogicalName(formContext: Xrm.FormContext): string {
    return formContext.data.entity.getEntityName();
  }

  static async getButtonSetting(buttonSettingName: string): Promise<unknown> {
    const fetchXml = `
        <fetch top="1">
        <entity name="esp_buttonsettings">
            <attribute name="esp_buttonsettingsid" />
            <attribute name="esp_endpoint" />
            <attribute name="esp_includecallinguserinpayload" />
            <attribute name="esp_includeentitylogicalnameinpayload" />
            <attribute name="esp_includerecordidinpayload" />
            <attribute name="esp_name" />
            <filter type="and">
            <condition attribute="esp_name" operator="eq" value="${buttonSettingName}" />
            </filter>
        </entity>
        </fetch>
    `;
    const query = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/esp_buttonsettingses" + query;
    const response = await Utils.makeRequest("GET", url);
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
    const response = await Utils.makeRequest("GET", url);
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
}
