var LCB;(()=>{"use strict";var e={};(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.FormLogic=void 0;var i=function(){function e(){}return e.toggleDialogSection=function(e){var t=e.getFormContext(),i=t.getAttribute("esp_showconfirmationdialog");if(i){var o=i.getValue(),n=t.ui.tabs.get("general");if(n){var s=n.sections.get("confirmation_dialog");s&&(o?s.setVisible(!0):s.setVisible(!1))}}},e.toggleSyncSection=function(e){var t=e.getFormContext(),i=t.getAttribute("esp_executionmode");if(i){var o=i.getValue(),n=t.ui.tabs.get("general");if(n){var s=n.sections.get("sync_settings");if(s){var g=n.sections.get("async_settings");g&&(0==o?(s.setVisible(!0),g.setVisible(!1)):(g.setVisible(!0),s.setVisible(!1)))}}}},e.toggleBoxSection=function(e){var t=e.getFormContext(),i=t.getAttribute("esp_syncconfirmationboxtype");if(i){var o=i.getValue(),n=t.ui.tabs.get("general");if(n){var s=n.sections.get("sync_confirmation_box");if(s){var g=n.sections.get("sync_confirmation_redirect");g&&(0==o?(s.setVisible(!0),g.setVisible(!1)):(g.setVisible(!0),s.setVisible(!1)))}}}},e.onFormLoad=function(t){e.toggleDialogSection(t),e.toggleSyncSection(t),e.toggleBoxSection(t)},e.onChange=function(t){e.toggleDialogSection(t),e.toggleSyncSection(t),e.toggleBoxSection(t)},e}();t.FormLogic=i})(),LCB=e})();