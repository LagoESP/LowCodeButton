var LCB;(()=>{"use strict";var t={97:function(t,e,n){var o=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(i,r){function a(t){try{s(o.next(t))}catch(t){r(t)}}function c(t){try{s(o.throw(t))}catch(t){r(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((o=o.apply(t,e||[])).next())}))},i=this&&this.__generator||function(t,e){var n,o,i,r={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},a=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return a.next=c(0),a.throw=c(1),a.return=c(2),"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(r=0)),r;)try{if(n=1,o&&(i=2&c[0]?o.return:c[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,c[1])).done)return i;switch(o=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,o=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(!((i=(i=r.trys).length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){r=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){r.label=c[1];break}if(6===c[0]&&r.label<i[1]){r.label=i[1],i=c;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(c);break}i[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(t){c=[6,t],o=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.BaseHelper=void 0;var r=n(842),a=function(){function t(){}return t.prototype.getButtonLocation=function(t){t&&("object"==typeof t.data?(this.formContext=t,this.containerType="form"):"function"==typeof t.getGrid&&(this.gridControl=t,"function"==typeof this.gridControl.getParent&&null!==this.gridControl.getParent()?this.containerType="subgrid":this.containerType="grid"))},t.prototype.getLanguageCode=function(){return Xrm.Utility.getGlobalContext().userSettings.languageId},t.prototype.getUserID=function(){return Xrm.Utility.getGlobalContext().userSettings.userId.replace("{","").replace("}","").toLowerCase()},t.prototype.getEntityPluralName=function(t){return o(this,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return[4,Xrm.Utility.getEntityMetadata(t)];case 1:return[2,e.sent().EntitySetName]}}))}))},t.prototype.makeRequest=function(t,e,n){return o(this,void 0,void 0,(function(){var o;return i(this,(function(i){return o={method:t,headers:{"Content-Type":"application/json","OData-MaxVersion":"4.0","OData-Version":"4.0",Accept:"application/json",Prefer:"odata.include-annotations=*"},body:n?JSON.stringify(n):void 0},[2,fetch(e,o)]}))}))},t.prototype.getButtonSetting=function(t){return o(this,void 0,void 0,(function(){var e,n,o,a,c;return i(this,(function(i){switch(i.label){case 0:e='\n      <fetch top="1">\n        <entity name="esp_buttonsetting">\n          <attribute name="esp_buttonsettingid" />\n          <attribute name="esp_buttonlocation" />\n          <attribute name="esp_endpoint" />\n          <attribute name="esp_includecallinguseridinpayload" />\n          <attribute name="esp_includeentitylogicalnameinpayload" />\n          <attribute name="esp_includerecordidinpayload" />\n          <attribute name="esp_buttonname" />\n          <attribute name="esp_savebeforerunning" />\n          <attribute name="esp_refreshwhenapicallends" />\n          <filter type="and">\n            <condition attribute="esp_buttonname" operator="eq" value="'.concat(t,'" />\n          </filter>\n        </entity>\n      </fetch>\n    '),n="?fetchXml=".concat(encodeURIComponent(e)),o="".concat(Xrm.Utility.getGlobalContext().getClientUrl(),"/api/data/v9.1/esp_buttonsettings").concat(n),i.label=1;case 1:return i.trys.push([1,4,,5]),[4,this.makeRequest("GET",o)];case 2:return[4,i.sent().json()];case 3:return a=i.sent(),c=a.value[0],this.buttonSetting=c,[2,c];case 4:return i.sent(),r.ExceptionLowCodeButton.buttonSettingNotFound(t),[2,null];case 5:return[2]}}))}))},t.prototype.getButtonAdvancedSetting=function(t,e){return o(this,void 0,void 0,(function(){var n,o,a,c,s;return i(this,(function(i){switch(i.label){case 0:n='\n      <fetch top="1">\n        <entity name="esp_buttonadvancedsetting">\n          <attribute name="esp_asyncformnotification" />\n          <attribute name="esp_asyncformnotificationtext" />\n          <attribute name="esp_buttonadvancedsettingid" />\n          <attribute name="esp_confirmationdialogcancellabel" />\n          <attribute name="esp_confirmationdialogconfirmlabel" />\n          <attribute name="esp_confirmationdialogsubtitle" />\n          <attribute name="esp_confirmationdialogtext" />\n          <attribute name="esp_confirmationdialogtitle" />\n          <attribute name="esp_executionmode" />\n          <attribute name="esp_mainbuttonsetting" />\n          <attribute name="esp_modificationneededflag" />\n          <attribute name="esp_settingid" />\n          <attribute name="esp_settinglanguage" />\n          <attribute name="esp_showconfirmationdialog" />\n          <attribute name="esp_syncconfirmationboxconfirmlabel" />\n          <attribute name="esp_syncconfirmationboxredirectcancellabel" />\n          <attribute name="esp_syncconfirmationboxredirectconfirmlabel" />\n          <attribute name="esp_syncconfirmationboxredirectmode" />\n          <attribute name="esp_syncconfirmationboxredirectsubtitle" />\n          <attribute name="esp_syncconfirmationboxredirecttext" />\n          <attribute name="esp_syncconfirmationboxredirecttitle" />\n          <attribute name="esp_syncconfirmationboxtext" />\n          <attribute name="esp_syncconfirmationboxtitle" />\n          <attribute name="esp_syncconfirmationboxtype" />\n          <attribute name="esp_syncformnotification" />\n          <attribute name="esp_syncformnotificationtext" />\n          <attribute name="esp_syncrefreshform" />\n          <attribute name="esp_syncspinner" />\n          <attribute name="esp_syncspinnertext" />\n          <attribute name="esp_syncsuccessformnotification" />\n          <attribute name="esp_syncsuccessformnotificationtext" />\n          <filter>\n            <condition attribute="esp_mainbuttonsetting" operator="eq" value="'.concat(t,'" />\n          </filter>\n          <link-entity name="esp_language" from="esp_languageid" to="esp_settinglanguage" link-type="inner">\n            <filter>\n              <condition attribute="esp_lcid" operator="eq" value="').concat(e,'" />\n            </filter>\n          </link-entity>\n        </entity>\n      </fetch>\n    '),o="?fetchXml=".concat(encodeURIComponent(n)),a="".concat(Xrm.Utility.getGlobalContext().getClientUrl(),"/api/data/v9.1/esp_buttonadvancedsettings").concat(o),i.label=1;case 1:return i.trys.push([1,4,,5]),[4,this.makeRequest("GET",a)];case 2:return[4,i.sent().json()];case 3:return c=i.sent(),s=c.value[0],this.buttonAdvancedSetting=s,[2,s];case 4:return i.sent(),r.ExceptionLowCodeButton.buttonAdvancedSettingNotFound(e),[2,null];case 5:return[2]}}))}))},t.prototype.getAllButtonAdvancedSettingExceptTheGivenLCID=function(t,e){return o(this,void 0,void 0,(function(){var n,o,a;return i(this,(function(i){switch(i.label){case 0:n='\n      <fetch>\n        <entity name="esp_buttonadvancedsetting">\n          <attribute name="esp_asyncformnotification" />\n          <attribute name="esp_asyncformnotificationtext" />\n          <attribute name="esp_buttonadvancedsettingid" />\n          <attribute name="esp_confirmationdialogcancellabel" />\n          <attribute name="esp_confirmationdialogconfirmlabel" />\n          <attribute name="esp_confirmationdialogsubtitle" />\n          <attribute name="esp_confirmationdialogtext" />\n          <attribute name="esp_confirmationdialogtitle" />\n          <attribute name="esp_executionmode" />\n          <attribute name="esp_mainbuttonsetting" />\n          <attribute name="esp_modificationneededflag" />\n          <attribute name="esp_settingid" />\n          <attribute name="esp_settinglanguage" />\n          <attribute name="esp_showconfirmationdialog" />\n          <attribute name="esp_syncconfirmationboxconfirmlabel" />\n          <attribute name="esp_syncconfirmationboxredirectcancellabel" />\n          <attribute name="esp_syncconfirmationboxredirectconfirmlabel" />\n          <attribute name="esp_syncconfirmationboxredirectmode" />\n          <attribute name="esp_syncconfirmationboxredirectsubtitle" />\n          <attribute name="esp_syncconfirmationboxredirecttext" />\n          <attribute name="esp_syncconfirmationboxredirecttitle" />\n          <attribute name="esp_syncconfirmationboxtext" />\n          <attribute name="esp_syncconfirmationboxtitle" />\n          <attribute name="esp_syncconfirmationboxtype" />\n          <attribute name="esp_syncformnotification" />\n          <attribute name="esp_syncformnotificationtext" />\n          <attribute name="esp_syncrefreshform" />\n          <attribute name="esp_syncspinner" />\n          <attribute name="esp_syncspinnertext" />\n          <attribute name="esp_syncsuccessformnotification" />\n          <attribute name="esp_syncsuccessformnotificationtext" />\n          <filter>\n            <condition attribute="esp_mainbuttonsetting" operator="eq" value="'.concat(t,'" />\n            <condition attribute="esp_settinglanguage" operator="ne" value="').concat(e,'" />\n          </filter>\n        </entity>\n      </fetch>\n    '),o="?fetchXml=".concat(encodeURIComponent(n)),a="".concat(Xrm.Utility.getGlobalContext().getClientUrl(),"/api/data/v9.1/esp_buttonadvancedsettings").concat(o),i.label=1;case 1:return i.trys.push([1,4,,5]),[4,this.makeRequest("GET",a)];case 2:return[4,i.sent().json()];case 3:return[2,i.sent().value];case 4:return i.sent(),r.ExceptionLowCodeButton.displayGenericErrorNotification("Error","Error while fetching the advanced button settings except the given LCID. Function name: getAllButtonAdvancedSettingExceptTheGivenLCID"),[2,[]];case 5:return[2]}}))}))},t.prototype.getFilterLookupForLanguage=function(t,e){return o(this,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return[4,this.getAllButtonAdvancedSettingExceptTheGivenLCID(t,e)];case 1:return[2,"<filter type='and'>"+n.sent().map((function(t){return'<condition attribute="esp_buttonadvancedsettingid" operator="ne" value="'.concat(t.esp_buttonadvancedsettingid,'" />')})).join("")+"</filter>"]}}))}))},t.prototype.initializeSettings=function(t){return o(this,void 0,void 0,(function(){var e;return i(this,(function(n){switch(n.label){case 0:return[4,this.getButtonSetting(t)];case 1:return(e=n.sent())?[4,this.getButtonAdvancedSetting(e.esp_buttonsettingid,this.getLanguageCode())]:[3,3];case 2:n.sent(),n.label=3;case 3:return[2]}}))}))},t}();e.BaseHelper=a},286:function(t,e,n){var o,i=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),r=this&&this.__assign||function(){return r=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},r.apply(this,arguments)},a=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(i,r){function a(t){try{s(o.next(t))}catch(t){r(t)}}function c(t){try{s(o.throw(t))}catch(t){r(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((o=o.apply(t,e||[])).next())}))},c=this&&this.__generator||function(t,e){var n,o,i,r={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},a=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return a.next=c(0),a.throw=c(1),a.return=c(2),"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(r=0)),r;)try{if(n=1,o&&(i=2&c[0]?o.return:c[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,c[1])).done)return i;switch(o=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,o=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(!((i=(i=r.trys).length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){r=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){r.label=c[1];break}if(6===c[0]&&r.label<i[1]){r.label=i[1],i=c;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(c);break}i[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(t){c=[6,t],o=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.ButtonFormHelper=void 0;var s=n(842),u=function(t){function e(e){var n=t.call(this)||this;return n.getButtonLocation(e),n}return i(e,t),e.create=function(t,n){return a(this,void 0,void 0,(function(){var o;return c(this,(function(i){switch(i.label){case 0:return[4,(o=new e(t)).initializeSettings(n)];case 1:return i.sent(),[2,o]}}))}))},e.prototype.getEntityLogicalName=function(){if(!this.formContext)throw new Error("Form context is not set.");return this.formContext.data.entity.getEntityName()},e.prototype.getRecordId=function(){if(!this.formContext)throw new Error("Form context is not set.");return this.formContext.data.entity.getId().replace("{","").replace("}","").toLowerCase()},e.prototype.getPayload=function(){return a(this,void 0,void 0,(function(){var t,e,n;return c(this,(function(o){switch(o.label){case 0:if(!this.formContext||!this.buttonSetting)throw new Error("Form context or button setting is not set.");return t={},this.buttonSetting.esp_includeentitylogicalnameinpayload?(t=r(r({},t),{entityLogicalSingularName:this.getEntityLogicalName()}),e=[r({},t)],n={},[4,this.getEntityPluralName(this.getEntityLogicalName())]):[3,2];case 1:t=r.apply(void 0,e.concat([(n.entityLogicalPluralName=o.sent(),n)])),o.label=2;case 2:return this.buttonSetting.esp_includerecordidinpayload&&(t=r(r({},t),{recordId:this.getRecordId()})),this.buttonSetting.esp_includecallinguseridinpayload&&(t=r(r({},t),{userId:this.getUserID()})),[2,t]}}))}))},e.prototype.openConfirmationDialogBeforeRun=function(){return a(this,void 0,void 0,(function(){var t,e,n,o,i;return c(this,(function(r){switch(r.label){case 0:return this.buttonAdvancedSetting&&null!=this.buttonAdvancedSetting.esp_confirmationdialogtext?[3,2]:[4,s.ExceptionLowCodeButton.displayGenericErrorNotification("Confirmation Dialog Text Error","The confirmation dialog text is empty! Please fill it on your configuration settings.")];case 1:return r.sent(),[2,!1];case 2:return t={cancelButtonLabel:null!==(e=this.buttonAdvancedSetting.esp_confirmationdialogcancellabel)&&void 0!==e?e:"",confirmButtonLabel:null!==(n=this.buttonAdvancedSetting.esp_confirmationdialogconfirmlabel)&&void 0!==n?n:"",subtitle:null!==(o=this.buttonAdvancedSetting.esp_confirmationdialogsubtitle)&&void 0!==o?o:"",text:null!==(i=this.buttonAdvancedSetting.esp_confirmationdialogtext)&&void 0!==i?i:"",title:this.buttonAdvancedSetting.esp_confirmationdialogtitle},[4,Xrm.Navigation.openConfirmDialog(t)];case 3:return[2,r.sent().confirmed]}}))}))},e.prototype.openSuccessDialogSync=function(){return a(this,void 0,void 0,(function(){var t,e,n;return c(this,(function(o){switch(o.label){case 0:return this.buttonAdvancedSetting&&null!=this.buttonAdvancedSetting.esp_syncconfirmationboxtext?[3,2]:[4,s.ExceptionLowCodeButton.displayGenericErrorNotification("Sync Confirmation Box Text Error","The sync confirmation box text is empty! Please fill it on your configuration settings.")];case 1:return o.sent(),[2,!1];case 2:return t={confirmButtonLabel:null!==(e=this.buttonAdvancedSetting.esp_syncconfirmationboxconfirmlabel)&&void 0!==e?e:void 0,text:null!==(n=this.buttonAdvancedSetting.esp_syncconfirmationboxtext)&&void 0!==n?n:void 0,title:this.buttonAdvancedSetting.esp_syncconfirmationboxtitle},[4,Xrm.Navigation.openAlertDialog(t)];case 3:return[2,o.sent().confirmed]}}))}))},e.prototype.openSuccessDialogRedirect=function(t){var e,n,o,i,r=this;if(!this.buttonAdvancedSetting)throw new Error("Button advanced setting is not set.");if(null!=this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext){var a={cancelButtonLabel:null!==(e=this.buttonAdvancedSetting.esp_syncconfirmationboxredirectcancellabel)&&void 0!==e?e:void 0,confirmButtonLabel:null!==(n=this.buttonAdvancedSetting.esp_syncconfirmationboxredirectconfirmlabel)&&void 0!==n?n:void 0,text:this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttext,subtitle:null!==(o=this.buttonAdvancedSetting.esp_syncconfirmationboxredirectsubtitle)&&void 0!==o?o:void 0,title:null!==(i=this.buttonAdvancedSetting.esp_syncconfirmationboxredirecttitle)&&void 0!==i?i:void 0};Xrm.Navigation.openConfirmDialog(a).then((function(e){e.confirmed?(console.log("User confirmed the dialog, redirecting..."),1===r.buttonAdvancedSetting.esp_syncconfirmationboxredirectmode?window.open(t.redirectUri,"_self").focus():window.open(t.redirectUri,"_blank").focus()):(console.log("User cancelled the dialog, refreshing the form."),r.reloadForm())}))}else s.ExceptionLowCodeButton.displayGenericErrorNotification("Sync Confirmation Box Redirect Text Error","The sync confirmation box redirect text is empty! Please fill it on your configuration settings.")},e.prototype.reloadForm=function(){if(!this.formContext||!this.buttonSetting||!this.buttonAdvancedSetting)throw new Error("Required properties are not set for reloading the form.");!this.buttonSetting.esp_refreshwhenapicallends||this.buttonAdvancedSetting.esp_syncconfirmationboxredirect&&1===this.buttonAdvancedSetting.esp_syncconfirmationboxredirectmode||this.formContext.data.refresh(!1)},e.prototype.asyncFormNotification=function(){return a(this,void 0,void 0,(function(){var t=this;return c(this,(function(e){switch(e.label){case 0:return this.formContext&&this.buttonAdvancedSetting&&null!=this.buttonAdvancedSetting.esp_asyncformnotificationtext?[3,2]:[4,s.ExceptionLowCodeButton.displayGenericErrorNotification("Async Form Notification Text Error","The async form notification text is empty! Please fill it on your configuration settings.")];case 1:return e.sent(),[2];case 2:return this.formContext.ui.setFormNotification(this.buttonAdvancedSetting.esp_asyncformnotificationtext,"INFO","LowCodeButtonFormNotification"),setTimeout((function(){t.formContext.ui.clearFormNotification("LowCodeButtonFormNotification")}),5e3),[2]}}))}))},e.prototype.clearFormNotification=function(){if(!this.formContext)throw new Error("Form context is not set.");this.formContext.ui.clearFormNotification("LowCodeButtonFormNotification")},e.prototype.syncFormNotification=function(){return a(this,void 0,void 0,(function(){var t=this;return c(this,(function(e){switch(e.label){case 0:return this.formContext&&this.buttonAdvancedSetting&&null!=this.buttonAdvancedSetting.esp_syncformnotificationtext?[3,2]:[4,s.ExceptionLowCodeButton.displayGenericErrorNotification("Sync Form Notification Text Error","The sync form notification text is empty! Please fill it on your configuration settings.")];case 1:return e.sent(),[2];case 2:return this.formContext.ui.setFormNotification(this.buttonAdvancedSetting.esp_syncformnotificationtext,"INFO","LowCodeButtonFormNotification"),setTimeout((function(){t.formContext.ui.clearFormNotification("LowCodeButtonFormNotification")}),12e4),[2]}}))}))},e.prototype.showSuccessFormNotification=function(){return a(this,void 0,void 0,(function(){var t=this;return c(this,(function(e){switch(e.label){case 0:return this.formContext&&this.buttonAdvancedSetting&&null!=this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext?[3,2]:[4,s.ExceptionLowCodeButton.displayGenericErrorNotification("Success Notification Text Error","The success notification text is empty! Please fill it on your configuration settings.\nField: esp_syncsuccessformnotificationtext")];case 1:return e.sent(),[2];case 2:return this.formContext.ui.setFormNotification(this.buttonAdvancedSetting.esp_syncsuccessformnotificationtext,"INFO","LowCodeButtonFormNotification"),setTimeout((function(){t.formContext.ui.clearFormNotification("LowCodeButtonFormNotification")}),5e3),[2]}}))}))},e.prototype.clearSyncNotifications=function(){var t,e;(null===(t=this.buttonAdvancedSetting)||void 0===t?void 0:t.esp_syncformnotification)&&this.clearFormNotification(),(null===(e=this.buttonAdvancedSetting)||void 0===e?void 0:e.esp_syncspinner)&&Xrm.Utility.closeProgressIndicator()},e}(n(97).BaseHelper);e.ButtonFormHelper=u},308:function(t,e,n){var o=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(i,r){function a(t){try{s(o.next(t))}catch(t){r(t)}}function c(t){try{s(o.throw(t))}catch(t){r(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((o=o.apply(t,e||[])).next())}))},i=this&&this.__generator||function(t,e){var n,o,i,r={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},a=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return a.next=c(0),a.throw=c(1),a.return=c(2),"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(r=0)),r;)try{if(n=1,o&&(i=2&c[0]?o.return:c[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,c[1])).done)return i;switch(o=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,o=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(!((i=(i=r.trys).length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){r=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){r.label=c[1];break}if(6===c[0]&&r.label<i[1]){r.label=i[1],i=c;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(c);break}i[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(t){c=[6,t],o=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.ButtonRegistrationForm=void 0;var r=n(842),a=n(286),c=n(331),s=function(){function t(){}return t.onClick=function(t,e){return o(this,void 0,void 0,(function(){var n;return i(this,(function(o){switch(o.label){case 0:return[4,(n=new a.ButtonFormHelper(t)).initializeSettings(e)];case 1:return o.sent(),n.buttonAdvancedSetting.esp_showconfirmationdialog?[4,n.openConfirmationDialogBeforeRun()]:[3,3];case 2:if(!o.sent())return[2];o.label=3;case 3:return t.data.entity.getIsDirty()&&n.buttonSetting.esp_savebeforerunning?(console.log("Saving form before running the button"),[4,t.data.save()]):[3,5];case 4:o.sent(),o.label=5;case 5:return n.buttonSetting.esp_endpoint?[3,7]:[4,r.ExceptionLowCodeButton.displayGenericErrorNotification("Endpoint Not Set","The endpoint for the button is not set. Please set it up in the button settings.")];case 6:return o.sent(),[2];case 7:return 1!==n.buttonAdvancedSetting.esp_executionmode?[3,9]:[4,this.executeAsync(n)];case 8:return o.sent(),[3,11];case 9:return[4,this.executeSync(n)];case 10:o.sent(),o.label=11;case 11:return[2]}}))}))},t.executeAsync=function(t){return o(this,void 0,void 0,(function(){var e,n,a,c,s,u=this;return i(this,(function(l){switch(l.label){case 0:return e=t.buttonSetting,n=t.buttonAdvancedSetting,console.log("Executing async call to ".concat(null==e?void 0:e.esp_endpoint)),(null==n?void 0:n.esp_asyncformnotification)&&t.asyncFormNotification(),c=(a=t).makeRequest,s=["POST",e.esp_endpoint],[4,t.getPayload()];case 1:return c.apply(a,s.concat([l.sent()])).catch((function(e){return o(u,void 0,void 0,(function(){return i(this,(function(n){switch(n.label){case 0:return[4,r.ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call",e.message)];case 1:return n.sent(),[4,t.clearFormNotification()];case 2:return n.sent(),[2]}}))}))})),[2]}}))}))},t.executeSync=function(t){return o(this,void 0,void 0,(function(){var e,n,a,s,u,l,f,d,p,b,m,h,y,g,v,x=this;return i(this,(function(_){switch(_.label){case 0:return e=t.buttonSetting,n=t.buttonAdvancedSetting,console.log("Executing sync call to ".concat(null==e?void 0:e.esp_endpoint)),(null==n?void 0:n.esp_syncformnotification)?[4,t.syncFormNotification()]:[3,2];case 1:_.sent(),_.label=2;case 2:return(null==n?void 0:n.esp_syncspinner)?n.esp_syncspinnertext?[3,4]:[4,r.ExceptionLowCodeButton.displayGenericErrorNotification("Sync Spinner Text Error","The sync spinner text is empty! Please fill it on your configuration settings.")]:[3,5];case 3:return _.sent(),[2];case 4:Xrm.Utility.showProgressIndicator(n.esp_syncspinnertext),_.label=5;case 5:return u=(s=t).makeRequest,l=["POST",e.esp_endpoint],[4,t.getPayload()];case 6:return[4,u.apply(s,l.concat([_.sent()])).catch((function(t){return o(x,void 0,void 0,(function(){return i(this,(function(e){switch(e.label){case 0:return[4,r.ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call",t.message)];case 1:return e.sent(),[2]}}))}))})).finally((function(){(null==n?void 0:n.esp_syncspinner)&&(Xrm.Utility.closeProgressIndicator(),t.clearFormNotification())}))];case 7:return(a=_.sent())?400!==a.status?[3,10]:(t.clearSyncNotifications(),p=(d=c.ErrorMessageResponse).fromJson,[4,a.text()]):[2];case 8:return f=p.apply(d,[_.sent()]),[4,r.ExceptionLowCodeButton.displayGenericErrorNotification(f.title,f.message)];case 9:return _.sent(),[2];case 10:return(null!==(g=a.status)&&void 0!==g?g:500)>=500?(t.clearSyncNotifications(),[4,a.text()]):[3,13];case 11:return b=null!==(v=_.sent())&&void 0!==v?v:"An error occurred on the server. Please try again later.",[4,r.ExceptionLowCodeButton.displayGenericErrorNotification("Error during HTTP Call","Error code: ".concat(a.status,"\n").concat(b))];case 12:return _.sent(),[2];case 13:return 200!==a.status?[3,20]:(t.clearSyncNotifications(),(null==n?void 0:n.esp_syncsuccessformnotification)?[4,t.showSuccessFormNotification()]:[3,15]);case 14:_.sent(),_.label=15;case 15:return 0!==(null==n?void 0:n.esp_syncconfirmationboxtype)?[3,17]:[4,t.openSuccessDialogSync()];case 16:_.sent(),_.label=17;case 17:return 1!==(null==n?void 0:n.esp_syncconfirmationboxtype)?[3,19]:(y=(h=c.RedirectResponse).fromJson,[4,a.text()]);case 18:m=y.apply(h,[_.sent()]),t.openSuccessDialogRedirect(m),_.label=19;case 19:t.reloadForm(),_.label=20;case 20:return[2]}}))}))},t}();e.ButtonRegistrationForm=s},331:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ErrorMessageResponse=e.RedirectResponse=void 0;var o=n(842),i=function(){function t(t){this.redirectUri=t}return t.fromJson=function(e){var n=JSON.parse(e);if("string"!=typeof n.redirectUri)throw o.ExceptionLowCodeButton.displayGenericErrorNotification("Redirect URI Not Found","The redirect URI was not found in the response."),new Error("Invalid JSON format for RedirectResponse");return new t(n.redirectUri)},t}();e.RedirectResponse=i;var r=function(){function t(t,e){this.message=t,this.title=e}return t.fromJson=function(e){var n,i=JSON.parse(e);if(console.log("Error message data",i),"string"!=typeof i.message)throw o.ExceptionLowCodeButton.displayGenericErrorNotification("Error Message Not Found","The error message was not found in the response."),new Error("Invalid JSON format for ErrorMessage");return new t(i.message,null!==(n=i.title)&&void 0!==n?n:"")},t}();e.ErrorMessageResponse=r},842:function(t,e){var n=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(i,r){function a(t){try{s(o.next(t))}catch(t){r(t)}}function c(t){try{s(o.throw(t))}catch(t){r(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((o=o.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,o,i,r={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},a=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return a.next=c(0),a.throw=c(1),a.return=c(2),"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(r=0)),r;)try{if(n=1,o&&(i=2&c[0]?o.return:c[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,c[1])).done)return i;switch(o=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,o=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(!((i=(i=r.trys).length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){r=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){r.label=c[1];break}if(6===c[0]&&r.label<i[1]){r.label=i[1],i=c;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(c);break}i[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(t){c=[6,t],o=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.ExceptionLowCodeButton=void 0;var i=function(){function t(){}return t.buttonSettingNotFound=function(t){return n(this,void 0,void 0,(function(){var e;return o(this,(function(n){switch(n.label){case 0:return e={text:"Button setting not found: ".concat(t),title:"Button Setting Not Found"},[4,Xrm.Navigation.openAlertDialog(e)];case 1:return n.sent(),[2]}}))}))},t.buttonAdvancedSettingNotFound=function(t){return n(this,void 0,void 0,(function(){var e;return o(this,(function(n){switch(n.label){case 0:return e={text:"Button advanced setting not found for the LCID ".concat(t),title:"Button Advanced Setting Not Found"},[4,Xrm.Navigation.openAlertDialog(e)];case 1:return n.sent(),[2]}}))}))},t.displayGenericErrorNotification=function(t,e){return n(this,void 0,void 0,(function(){var n;return o(this,(function(o){switch(o.label){case 0:return n={text:e,title:t},[4,Xrm.Navigation.openAlertDialog(n)];case 1:return o.sent(),[2]}}))}))},t}();e.ExceptionLowCodeButton=i}},e={},n=function n(o){var i=e[o];if(void 0!==i)return i.exports;var r=e[o]={exports:{}};return t[o].call(r.exports,r,r.exports,n),r.exports}(308);LCB=n})();