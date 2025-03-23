/* eslint-disable*/
import { IEntity } from "dataverse-ify";
// Entity esp_ButtonSetting
export const esp_buttonsettingMetadata = {
  typeName: "mscrm.esp_buttonsetting",
  logicalName: "esp_buttonsetting",
  collectionName: "esp_buttonsettings",
  primaryIdAttribute: "esp_buttonsettingid",
  attributeTypes: {
    // Numeric Types
    importsequencenumber: "Integer",
    timezoneruleversionnumber: "Integer",
    utcconversiontimezonecode: "Integer",
    versionnumber: "BigInt",
    // Optionsets
    esp_buttonlocation: "Optionset",
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
    modifiedby: ["mscrm.systemuser"],
    modifiedonbehalfby: ["mscrm.systemuser"],
    ownerid: ["mscrm.principal"],
    owningbusinessunit: ["mscrm.businessunit"],
    owningteam: ["mscrm.team"],
    owninguser: ["mscrm.systemuser"],
  },
};

// Attribute constants
export const enum esp_ButtonSettingAttributes {
  CreatedBy = "createdby",
  CreatedByName = "createdbyname",
  CreatedByYomiName = "createdbyyominame",
  CreatedOn = "createdon",
  CreatedOnBehalfBy = "createdonbehalfby",
  CreatedOnBehalfByName = "createdonbehalfbyname",
  CreatedOnBehalfByYomiName = "createdonbehalfbyyominame",
  esp_ButtonLocation = "esp_buttonlocation",
  esp_ButtonName = "esp_buttonname",
  esp_ButtonSettingId = "esp_buttonsettingid",
  esp_Endpoint = "esp_endpoint",
  esp_IncludeCallingUserIDinPayload = "esp_includecallinguseridinpayload",
  esp_IncludeEntityLogicalNameinPayload = "esp_includeentitylogicalnameinpayload",
  esp_IncludeRecordIDinPayload = "esp_includerecordidinpayload",
  esp_RefreshWhenAPICallEnds = "esp_refreshwhenapicallends",
  esp_SaveBeforeRunning = "esp_savebeforerunning",
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
export interface esp_ButtonSetting extends IEntity {
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
  Button Location [Required] esp_buttonsetting_esp_buttonsetting_esp_buttonlocation Location Type for the button. Either Form or Grid/Subgrid
  */
  esp_buttonlocation?: import("../enums/esp_buttonsetting_esp_buttonsetting_esp_buttonlocation").esp_buttonsetting_esp_buttonsetting_esp_buttonlocation;
  /*
  Button Name [Required] StringType Button Name (Unique, alternate key)
  */
  esp_buttonname?: string;
  /*
  Button Setting UniqueidentifierType Unique identifier for entity instances
  */
  esp_buttonsettingid?: import("dataverse-ify").Guid | null;
  /*
  Endpoint [Required] StringType Endpoint to call the Power Automate Flow URL / Logic App
  */
  esp_endpoint?: string;
  /*
  Include Calling User ID in Payload [Required] BooleanType Include Calling User ID in Payload
  */
  esp_includecallinguseridinpayload?: boolean;
  /*
  Include Entity Logical Name in Payload [Required] BooleanType Include Entity Logical Name in Payload
  */
  esp_includeentitylogicalnameinpayload?: boolean;
  /*
  Include Record ID in Payload [Required] BooleanType Include Record ID in Payload
  */
  esp_includerecordidinpayload?: boolean;
  /*
  Refresh When API Call Ends [Required] BooleanType Refresh When API Call Ends
  */
  esp_refreshwhenapicallends?: boolean;
  /*
  Save Before Running [Required] BooleanType Saves the form before running, so Power Automate can fetch the freshest details.
  */
  esp_savebeforerunning?: boolean;
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
  Status esp_buttonsetting_esp_buttonsetting_statecode Status of the Button Setting
  */
  statecode?: import("../enums/esp_buttonsetting_esp_buttonsetting_statecode").esp_buttonsetting_esp_buttonsetting_statecode | null;
  /*
  Status Reason esp_buttonsetting_esp_buttonsetting_statuscode Reason for the status of the Button Setting
  */
  statuscode?: import("../enums/esp_buttonsetting_esp_buttonsetting_statuscode").esp_buttonsetting_esp_buttonsetting_statuscode | null;
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
