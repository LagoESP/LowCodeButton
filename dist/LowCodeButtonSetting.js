var LCB;(()=>{"use strict";var t={};({419:function(t,e){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var a in e=arguments[n])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},n.apply(this,arguments)},o=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))((function(a,i){function l(t){try{u(o.next(t))}catch(t){i(t)}}function r(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(l,r)}u((o=o.apply(t,e||[])).next())}))},a=this&&this.__generator||function(t,e){var n,o,a,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},l=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return l.next=r(0),l.throw=r(1),l.return=r(2),"function"==typeof Symbol&&(l[Symbol.iterator]=function(){return this}),l;function r(r){return function(u){return function(r){if(n)throw new TypeError("Generator is already executing.");for(;l&&(l=0,r[0]&&(i=0)),i;)try{if(n=1,o&&(a=2&r[0]?o.return:r[0]?o.throw||((a=o.return)&&a.call(o),0):o.next)&&!(a=a.call(o,r[1])).done)return a;switch(o=0,a&&(r=[2&r[0],a.value]),r[0]){case 0:case 1:a=r;break;case 4:return i.label++,{value:r[1],done:!1};case 5:i.label++,o=r[1],r=[0];continue;case 7:r=i.ops.pop(),i.trys.pop();continue;default:if(!((a=(a=i.trys).length>0&&a[a.length-1])||6!==r[0]&&2!==r[0])){i=0;continue}if(3===r[0]&&(!a||r[1]>a[0]&&r[1]<a[3])){i.label=r[1];break}if(6===r[0]&&i.label<a[1]){i.label=a[1],a=r;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(r);break}a[2]&&i.ops.pop(),i.trys.pop();continue}r=e.call(t,i)}catch(t){r=[6,t],o=0}finally{n=a=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,u])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.ButtonSetting=void 0;var i=function(){function t(){}return t.onLoad=function(t){var e,n=null==t?void 0:t.getFormContext();n.getControl("esp_examplepayload").setVisible(null===(e=n.getAttribute("esp_showexamplepayload"))||void 0===e?void 0:e.getValue())},t.onChange=function(t){return o(this,void 0,void 0,(function(){var e,n,o,i;return a(this,(function(a){switch(a.label){case 0:return(e=null==t?void 0:t.getFormContext()).getControl("esp_examplepayload").setVisible(null===(n=e.getAttribute("esp_showexamplepayload"))||void 0===n?void 0:n.getValue()),(null===(o=e.getAttribute("esp_showexamplepayload"))||void 0===o?void 0:o.getValue())?(null===(i=e.getAttribute("esp_examplepayload"))||void 0===i||i.setValue(this.getFormattedExamplePayload(e)),e.data.getIsDirty()&&2===e.ui.getFormType()?[4,e.data.save()]:[3,2]):[3,2];case 1:a.sent(),a.label=2;case 2:return[2]}}))}))},t.getFormattedExamplePayload=function(t){var e,o,a,i,l,r,u,c,s={};return(null===(e=t.getAttribute("esp_includecallinguseridinpayload"))||void 0===e?void 0:e.getValue())&&(s=n(n({},s),{userId:"UserId"})),(null===(o=t.getAttribute("esp_includeentitylogicalnameinpayload"))||void 0===o?void 0:o.getValue())&&(s=n(n({},s),{entityLogicalSingularName:"account",entityLogicalPluralName:"accounts"}),789620002===(null===(a=t.getAttribute("esp_buttonlocation"))||void 0===a?void 0:a.getValue())&&(s=n(n({},s),{parentEntityLogicalName:"contact",parentEntityLogicalPluralName:"contacts"}))),(null===(i=t.getAttribute("esp_includerecordidinpayload"))||void 0===i?void 0:i.getValue())&&(78962e4===(null===(l=t.getAttribute("esp_buttonlocation"))||void 0===l?void 0:l.getValue())&&(s=n(n({},s),{recordId:"Guid"})),789620001!==(null===(r=t.getAttribute("esp_buttonlocation"))||void 0===r?void 0:r.getValue())&&789620002!==(null===(u=t.getAttribute("esp_buttonlocation"))||void 0===u?void 0:u.getValue())||(s=n(n({},s),{recordIds:["Guid1","Guid2"]}),789620002===(null===(c=t.getAttribute("esp_buttonlocation"))||void 0===c?void 0:c.getValue())&&(s=n(n({},s),{parentRecordId:"Guid"})))),JSON.stringify(s,null,2)},t}();e.ButtonSetting=i}})[419](0,t),LCB=t})();