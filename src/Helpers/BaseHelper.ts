/* eslint-disable camelcase */
import { esp_ButtonAdvancedSetting, esp_ButtonSetting } from "../dataverse-gen";
import { ExceptionLowCodeButton } from "../Exceptions/ButtonException";

export type ButtonContainerType = "form" | "grid" | "subgrid";

/**
 * BaseHelper provides core functionality for determining context type and retrieving
 * configuration objects (button setting and advanced setting) using fetch XML queries.
 */
export class BaseHelper {
  public formContext?: Xrm.FormContext;
  public gridControl?: Xrm.Controls.GridControl;
  public containerType?: ButtonContainerType;
  public buttonSetting?: esp_ButtonSetting;
  public buttonAdvancedSetting?: esp_ButtonAdvancedSetting;

  /**
   * Determines the button location based on the provided context.
   * - If the context is a FormContext, sets containerType to "form" and stores it.
   * - If the context is a GridControl, sets containerType to "grid" or "subgrid"
   *   depending on whether getParent() returns a non-null value.
   *
   * @param context - Either a FormContext or a GridControl.
   */
  public getButtonLocation(context?: Xrm.FormContext | Xrm.Controls.GridControl): void {
    if (context) {
      if (typeof (context as Xrm.FormContext).data === "object") {
        this.formContext = context as Xrm.FormContext;
        this.containerType = "form";
      } else if (typeof (context as Xrm.Controls.GridControl).getGrid === "function") {
        this.gridControl = context as Xrm.Controls.GridControl;
        if (typeof this.gridControl.getParent === "function" && this.gridControl.getParent() !== null) {
          this.containerType = "subgrid";
        } else {
          this.containerType = "grid";
        }
      }
    }
  }

  /**
   * Retrieves the current user's language code from the global context.
   *
   * @returns The language code.
   */
  public getLanguageCode(): number {
    return Xrm.Utility.getGlobalContext().userSettings.languageId;
  }

  /**
   * Retrieves the current user's ID as a lowercase string with curly braces removed.
   *
   * @returns The user ID.
   */
  public getUserID(): string {
    return Xrm.Utility.getGlobalContext().userSettings.userId.replace("{", "").replace("}", "").toLowerCase();
  }

  /**
   * Makes an HTTP request using fetch with pre-configured headers.
   *
   * @param method - The HTTP method (e.g., "GET", "POST").
   * @param url - The URL to send the request to.
   * @param body - Optional request body.
   * @returns A Promise that resolves to the Response.
   */
  public async makeRequest(method: string, url: string, body?: unknown): Promise<Response> {
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

  /**
   * Retrieves the button setting record using the provided button setting name.
   *
   * @param buttonSettingName - The name of the button setting to retrieve.
   * @returns A Promise that resolves to the esp_ButtonSetting or null.
   * @throws An error if the fetch fails.
   */
  public async getButtonSetting(buttonSettingName: string): Promise<esp_ButtonSetting | null> {
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
    } catch {
      ExceptionLowCodeButton.buttonSettingNotFound(buttonSettingName);
      return null;
    }
  }

  /**
   * Retrieves the advanced button setting record using the main button setting ID and language code.
   *
   * @param mainButtonSettingId - The ID of the main button setting.
   * @param lcid - The language code.
   * @returns A Promise that resolves to the esp_ButtonAdvancedSetting or null.
   * @throws An error if the fetch fails.
   */
  public async getButtonAdvancedSetting(
    mainButtonSettingId: string,
    lcid: number,
  ): Promise<esp_ButtonAdvancedSetting | null> {
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
    } catch {
      ExceptionLowCodeButton.buttonAdvancedSettingNotFound(lcid);
      return null;
    }
  }

  /**
   * Initializes settings by retrieving the button setting (using its name) and then the advanced button setting.
   *
   * @param buttonSettingName - The name of the button setting to retrieve.
   */
  public async initializeSettings(buttonSettingName: string): Promise<void> {
    const setting = await this.getButtonSetting(buttonSettingName);
    if (setting) {
      await this.getButtonAdvancedSetting(setting.esp_buttonsettingid!, this.getLanguageCode());
    }
  }
}
