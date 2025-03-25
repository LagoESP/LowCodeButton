/// <reference types="xrm" />

namespace LCBForm {
    export class FormLogic {

        public static toggleDialogSection(executionContext: Xrm.Events.EventContext): void {
            const formContext = executionContext.getFormContext();

            // Retrieve the boolean value from field "esp_showconfirmationdialog".
            const dialogField = formContext.getAttribute("esp_showconfirmationdialog");
            if (!dialogField) {
                return;
            }

            const dialogValue = dialogField.getValue();

            // Retrieve the relevant tab and section
            const targetTab = formContext.ui.tabs.get("general");
            if (!targetTab) {
                return;
            }

            const dialogSection = targetTab.sections.get("confirmation_dialog");
            if (!dialogSection) {
                return;
            }

            // Show section "confirmation_dialog" if boolean is true, hide if false (or null).
            if (dialogValue) {
                dialogSection.setVisible(true);
            } else {
                dialogSection.setVisible(false);
            }
        }

        public static toggleSyncSection(executionContext: Xrm.Events.EventContext): void {
            const formContext = executionContext.getFormContext();

            const syncField = formContext.getAttribute("esp_executionmode");
            if (!syncField) {
                return;
            }

            const syncValue = syncField.getValue();

            const targetTab = formContext.ui.tabs.get("general");
            if (!targetTab) {
                return;
            }

            // Get both sync and async sections, as one of them must always be visible
            const syncSection = targetTab.sections.get("sync_settings");
            if (!syncSection) {
                return;
            }
            const asyncSection = targetTab.sections.get("async_settings");
            if (!asyncSection) {
                return;
            }

            if (syncValue == 0) {
                syncSection.setVisible(true);
                asyncSection.setVisible(false);
            } else {
                asyncSection.setVisible(true);
                syncSection.setVisible(false);
            }
        }

        public static toggleBoxSection(executionContext: Xrm.Events.EventContext): void {
            const formContext = executionContext.getFormContext();

            const boxField = formContext.getAttribute("esp_syncconfirmationboxtype");
            if (!boxField) {
                return;
            }

            const boxValue = boxField.getValue();

            const targetTab = formContext.ui.tabs.get("general");
            if (!targetTab) {
                return;
            }

            const defaultBoxSection = targetTab.sections.get("sync_confirmation_box");
            if (!defaultBoxSection) {
                return;
            }
            const redirectBoxSection = targetTab.sections.get("sync_confirmation_redirect");
            if (!redirectBoxSection) {
                return;
            }

            if (boxValue == 0) {
                defaultBoxSection.setVisible(true);
                redirectBoxSection.setVisible(false);
            } if (boxValue == 1) {
                redirectBoxSection.setVisible(true);
                defaultBoxSection.setVisible(false);
            } else {
                redirectBoxSection.setVisible(false);
                defaultBoxSection.setVisible(false);
            }
        }

        //On load functions
        public static onFormLoad(executionContext: Xrm.Events.EventContext): void {
            FormLogic.toggleDialogSection(executionContext);
            FormLogic.toggleSyncSection(executionContext);
            FormLogic.toggleBoxSection(executionContext);
        }

        //On change functions
        public static onChange(executionContext: Xrm.Events.EventContext): void {
            FormLogic.toggleDialogSection(executionContext);
            FormLogic.toggleSyncSection(executionContext);
            FormLogic.toggleBoxSection(executionContext);
        }
    }
}
