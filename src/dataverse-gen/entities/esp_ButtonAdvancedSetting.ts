/* eslint-disable*/
import { IEntity } from "dataverse-ify";
// Entity esp_ButtonAdvancedSetting
export const esp_buttonadvancedsettingMetadata = {
  typeName: "mscrm.esp_buttonadvancedsetting",
  logicalName: "esp_buttonadvancedsetting",
  collectionName: "esp_buttonadvancedsettings",
  primaryIdAttribute: "esp_buttonadvancedsettingid",
  attributeTypes: {
    // Numeric Types
    importsequencenumber: "Integer",
    timezoneruleversionnumber: "Integer",
    utcconversiontimezonecode: "Integer",
    versionnumber: "BigInt",
    // Optionsets
    esp_executionmode: "Optionset",
    esp_syncconfirmationboxredirectmode: "Optionset",
    esp_syncconfirmationboxtype: "Optionset",
    statecode: "Optionset",
    statuscode: "Optionset",
    // Date Formats
    createdon: "DateAndTime:UserLocal",
    modifiedon: "DateAndTime:UserLocal",
    overriddencreatedon: "DateOnly:UserLocal",
  },
  navigation: {
    createdby: ["mscrm.systemuser"],
    createdonbehalfby: ["mscrm.systemuser"],
    esp_MainButtonSetting: ["mscrm.esp_buttonsetting"],
    esp_SettingLanguage: ["mscrm.esp_language"],
    modifiedby: ["mscrm.systemuser"],
    modifiedonbehalfby: ["mscrm.systemuser"],
    ownerid: ["mscrm.principal"],
    owningbusinessunit: ["mscrm.businessunit"],
    owningteam: ["mscrm.team"],
    owninguser: ["mscrm.systemuser"],
  },
};

// Attribute constants
export const enum esp_ButtonAdvancedSettingAttributes {
  CreatedBy = "createdby",
  CreatedByName = "createdbyname",
  CreatedByYomiName = "createdbyyominame",
  CreatedOn = "createdon",
  CreatedOnBehalfBy = "createdonbehalfby",
  CreatedOnBehalfByName = "createdonbehalfbyname",
  CreatedOnBehalfByYomiName = "createdonbehalfbyyominame",
  esp_AsyncFormNotification = "esp_asyncformnotification",
  esp_AsyncFormNotificationText = "esp_asyncformnotificationtext",
  esp_ButtonAdvancedSettingId = "esp_buttonadvancedsettingid",
  esp_ConfirmationDialogCancelLabel = "esp_confirmationdialogcancellabel",
  esp_ConfirmationDialogConfirmLabel = "esp_confirmationdialogconfirmlabel",
  esp_ConfirmationDialogSubtitle = "esp_confirmationdialogsubtitle",
  esp_ConfirmationDialogText = "esp_confirmationdialogtext",
  esp_ConfirmationDialogTitle = "esp_confirmationdialogtitle",
  esp_ExecutionMode = "esp_executionmode",
  esp_MainButtonSetting = "esp_mainbuttonsetting",
  esp_MainButtonSettingName = "esp_mainbuttonsettingname",
  esp_SettingID = "esp_settingid",
  esp_SettingLanguage = "esp_settinglanguage",
  esp_SettingLanguageName = "esp_settinglanguagename",
  esp_ShowConfirmationDialog = "esp_showconfirmationdialog",
  esp_SyncConfirmationBoxConfirmLabel = "esp_syncconfirmationboxconfirmlabel",
  esp_SyncConfirmationBoxRedirectCancelLabel = "esp_syncconfirmationboxredirectcancellabel",
  esp_SyncConfirmationBoxRedirectConfirmLabel = "esp_syncconfirmationboxredirectconfirmlabel",
  esp_SyncConfirmationBoxRedirectMode = "esp_syncconfirmationboxredirectmode",
  esp_SyncConfirmationBoxRedirectSubtitle = "esp_syncconfirmationboxredirectsubtitle",
  esp_SyncConfirmationBoxRedirectText = "esp_syncconfirmationboxredirecttext",
  esp_SyncConfirmationBoxRedirectTitle = "esp_syncconfirmationboxredirecttitle",
  esp_SyncConfirmationBoxText = "esp_syncconfirmationboxtext",
  esp_SyncConfirmationBoxTitle = "esp_syncconfirmationboxtitle",
  esp_SyncConfirmationBoxType = "esp_syncconfirmationboxtype",
  esp_SyncFormNotification = "esp_syncformnotification",
  esp_SyncFormNotificationText = "esp_syncformnotificationtext",
  esp_SyncRefreshForm = "esp_syncrefreshform",
  esp_SyncSpinner = "esp_syncspinner",
  esp_SyncSpinnerText = "esp_syncspinnertext",
  esp_SyncSuccessFormNotification = "esp_syncsuccessformnotification",
  esp_SyncSuccessFormNotificationText = "esp_syncsuccessformnotificationtext",
  ImportSequenceNumber = "importsequencenumber",
  ModifiedBy = "modifiedby",
  ModifiedByName = "modifiedbyname",
  ModifiedByYomiName = "modifiedbyyominame",
  ModifiedOn = "modifiedon",
  ModifiedOnBehalfBy = "modifiedonbehalfby",
  ModifiedOnBehalfByName = "modifiedonbehalfbyname",
  ModifiedOnBehalfByYomiName = "modifiedonbehalfbyyominame",
  OverriddenCreatedOn = "overriddencreatedon",
  OwnerId = "ownerid",
  OwnerIdName = "owneridname",
  OwnerIdType = "owneridtype",
  OwnerIdYomiName = "owneridyominame",
  OwningBusinessUnit = "owningbusinessunit",
  OwningBusinessUnitName = "owningbusinessunitname",
  OwningTeam = "owningteam",
  OwningUser = "owninguser",
  statecode = "statecode",
  statuscode = "statuscode",
  TimeZoneRuleVersionNumber = "timezoneruleversionnumber",
  UTCConversionTimeZoneCode = "utcconversiontimezonecode",
  VersionNumber = "versionnumber",
}
// Early Bound Interface
export interface esp_ButtonAdvancedSetting extends IEntity {
  /*
  Created By LookupType Unique identifier of the user who created the record.
  */
  createdby?: import("dataverse-ify").EntityReference | null;
  /*
   StringType
  */
  createdbyname?: string | null;
  /*
   StringType
  */
  createdbyyominame?: string | null;
  /*
  Created On DateTimeType Date and time when the record was created. DateAndTime:UserLocal
  */
  createdon?: Date | null;
  /*
  Created By (Delegate) LookupType Unique identifier of the delegate user who created the record.
  */
  createdonbehalfby?: import("dataverse-ify").EntityReference | null;
  /*
   StringType
  */
  createdonbehalfbyname?: string | null;
  /*
   StringType
  */
  createdonbehalfbyyominame?: string | null;
  /*
  Async Form Notification BooleanType
  */
  esp_asyncformnotification?: boolean | null;
  /*
  Async Form Notification Text StringType
  */
  esp_asyncformnotificationtext?: string | null;
  /*
  Button Advanced Setting UniqueidentifierType Unique identifier for entity instances
  */
  esp_buttonadvancedsettingid?: import("dataverse-ify").Guid | null;
  /*
  Confirmation Dialog Cancel Label StringType Text for cancel button in Confirmation Dialog
  */
  esp_confirmationdialogcancellabel?: string | null;
  /*
  Confirmation Dialog Confirm Label StringType Text of confirm button in Confirmation Dialog
  */
  esp_confirmationdialogconfirmlabel?: string | null;
  /*
  Confirmation Dialog Subtitle StringType
  */
  esp_confirmationdialogsubtitle?: string | null;
  /*
  Confirmation Dialog Text [Required] StringType
  */
  esp_confirmationdialogtext?: string;
  /*
  Confirmation Dialog Title StringType
  */
  esp_confirmationdialogtitle?: string | null;
  /*
  Execution Mode esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode Field to toggle Sync or Async execution mode
  */
  esp_executionmode?: import("../enums/esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode").esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_executionmode | null;
  /*
  Main Button Setting [Required] LookupType Lookup to Main Button Setting
  */
  esp_mainbuttonsetting?: import("dataverse-ify").EntityReference;
  /*
   StringType
  */
  esp_mainbuttonsettingname?: string | null;
  /*
  Setting ID [Required] StringType
  */
  esp_settingid?: string;
  /*
  Setting Language [Required] LookupType LCID which this Advanced setting would be based on
  */
  esp_settinglanguage?: import("dataverse-ify").EntityReference;
  /*
   StringType
  */
  esp_settinglanguagename?: string | null;
  /*
  Show Confirmation Dialog BooleanType Field to toggle Confirmation Dialog
  */
  esp_showconfirmationdialog?: boolean | null;
  /*
  Sync Confirmation Box Confirm Label StringType The text for the confirmation button for the sync confirmation box
  */
  esp_syncconfirmationboxconfirmlabel?: string | null;
  /*
  Sync Confirmation Box Redirect Cancel Label StringType Label for cancel button in confirmation box with redirect function
  */
  esp_syncconfirmationboxredirectcancellabel?: string | null;
  /*
  Sync Confirmation Box Redirect Confirm Label StringType Label for confirm button for redirect confirmation box
  */
  esp_syncconfirmationboxredirectconfirmlabel?: string | null;
  /*
  Sync Confirmation Box Redirect Mode esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode A toggle for redirection mode. Either redirect in current tab or new tab
  */
  esp_syncconfirmationboxredirectmode?: import("../enums/esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode").esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxredirectmode | null;
  /*
  Sync Confirmation Box Redirect Subtitle StringType
  */
  esp_syncconfirmationboxredirectsubtitle?: string | null;
  /*
  Sync Confirmation Box Redirect Text StringType
  */
  esp_syncconfirmationboxredirecttext?: string | null;
  /*
  Sync Confirmation Box Redirect Title StringType
  */
  esp_syncconfirmationboxredirecttitle?: string | null;
  /*
  Sync Confirmation Box Text StringType
  */
  esp_syncconfirmationboxtext?: string | null;
  /*
  Sync Confirmation Box Title StringType
  */
  esp_syncconfirmationboxtitle?: string | null;
  /*
  Sync Confirmation Box Type esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype A field to toggle either the standard confirmation box or the redirect confirmation box
  */
  esp_syncconfirmationboxtype?: import("../enums/esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype").esp_buttonadvancedsetting_esp_buttonadvancedsetting_esp_syncconfirmationboxtype | null;
  /*
  Sync Form Notification BooleanType A field to toggle the use of Sync Form Notifications
  */
  esp_syncformnotification?: boolean | null;
  /*
  Sync Form Notification Text StringType
  */
  esp_syncformnotificationtext?: string | null;
  /*
  Sync Refresh Form BooleanType A field to toggle whether the form is refreshed upon sync completion
  */
  esp_syncrefreshform?: boolean | null;
  /*
  Sync Spinner BooleanType A field to toggle a loading spinner on sync notification
  */
  esp_syncspinner?: boolean | null;
  /*
  Sync Spinner Text StringType A text underneath the sync loading spinner
  */
  esp_syncspinnertext?: string | null;
  /*
  Sync Success Form Notification BooleanType A field to toggle success notification
  */
  esp_syncsuccessformnotification?: boolean | null;
  /*
  Sync Success Form Notification Text StringType
  */
  esp_syncsuccessformnotificationtext?: string | null;
  /*
  Import Sequence Number IntegerType Sequence number of the import that created this record.
  */
  importsequencenumber?: number | null;
  /*
  Modified By LookupType Unique identifier of the user who modified the record.
  */
  modifiedby?: import("dataverse-ify").EntityReference | null;
  /*
   StringType
  */
  modifiedbyname?: string | null;
  /*
   StringType
  */
  modifiedbyyominame?: string | null;
  /*
  Modified On DateTimeType Date and time when the record was modified. DateAndTime:UserLocal
  */
  modifiedon?: Date | null;
  /*
  Modified By (Delegate) LookupType Unique identifier of the delegate user who modified the record.
  */
  modifiedonbehalfby?: import("dataverse-ify").EntityReference | null;
  /*
   StringType
  */
  modifiedonbehalfbyname?: string | null;
  /*
   StringType
  */
  modifiedonbehalfbyyominame?: string | null;
  /*
  Record Created On DateTimeType Date and time that the record was migrated. DateOnly:UserLocal
  */
  overriddencreatedon?: Date | null;
  /*
  Owner OwnerType Owner Id
  */
  ownerid?: import("dataverse-ify").EntityReference | null;
  /*
   StringType Name of the owner
  */
  owneridname?: string | null;
  /*
   EntityNameType Owner Id Type
  */
  owneridtype?: string | null;
  /*
   StringType Yomi name of the owner
  */
  owneridyominame?: string | null;
  /*
  Owning Business Unit LookupType Unique identifier for the business unit that owns the record
  */
  owningbusinessunit?: import("dataverse-ify").EntityReference | null;
  /*
   StringType
  */
  owningbusinessunitname?: string | null;
  /*
  Owning Team LookupType Unique identifier for the team that owns the record.
  */
  owningteam?: import("dataverse-ify").EntityReference | null;
  /*
  Owning User LookupType Unique identifier for the user that owns the record.
  */
  owninguser?: import("dataverse-ify").EntityReference | null;
  /*
  Status esp_buttonadvancedsetting_esp_buttonadvancedsetting_statecode Status of the Button Advanced Setting
  */
  statecode?: import("../enums/esp_buttonadvancedsetting_esp_buttonadvancedsetting_statecode").esp_buttonadvancedsetting_esp_buttonadvancedsetting_statecode | null;
  /*
  Status Reason esp_buttonadvancedsetting_esp_buttonadvancedsetting_statuscode Reason for the status of the Button Advanced Setting
  */
  statuscode?: import("../enums/esp_buttonadvancedsetting_esp_buttonadvancedsetting_statuscode").esp_buttonadvancedsetting_esp_buttonadvancedsetting_statuscode | null;
  /*
  Time Zone Rule Version Number IntegerType For internal use only.
  */
  timezoneruleversionnumber?: number | null;
  /*
  UTC Conversion Time Zone Code IntegerType Time zone code that was in use when the record was created.
  */
  utcconversiontimezonecode?: number | null;
  /*
  Version Number BigIntType Version Number
  */
  versionnumber?: number | null;
}
