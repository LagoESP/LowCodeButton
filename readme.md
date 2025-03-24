# Low Code Button Documentation

## Overview

Low Code Button is a lightweight, customizable component designed for developers and Dynamics 365 customizers. This repository provides a managed solution to easily integrate and manage interactive buttons within your Dynamics 365 environment.

---

## Installation and Setup

### Download and Import

1. **Download the latest managed solution** from the [releases section](https://github.com/LagoESP/LowCodeButton/releases) of this repository.

2. **Import the solution** into your Dynamics 365 environment:

- As the main recommended method, navigate to [make.powerapps.com](https://make.powerapps.com), go to the solutions section, and import the downloaded managed solution.
- Alternatively, you can also import the solution via **Settings > Solutions** directly within Dynamics 365.
  - Go to **Settings > Solutions**.
  - Import the downloaded managed solution.

### Security Roles

The solution includes two predefined security roles:

- **LowCodeButtonMaker**: Full permissions for configuring and updating buttons.
- **LowCodeButtonUser**: Limited read-only access, ideal for end users.

Assign these roles appropriately based on user responsibilities.

---

## Registering the Button in the LCB Settings App

### Preparing Languages

1. Open the provided model-driven app **LCB (Low Code Button) Settings**.
2. Create required language entries:
   - Add languages with their corresponding LCID (`esp_lcid`).
   - Ensure the `LCID` is unique as it serves as an alternate key.
   
![image](https://github.com/user-attachments/assets/b7f1b7d8-0bad-4cf1-a81a-f38a31bde474)

### Button Settings

1. Within the **LCB (Low Code Button) Settings** app, navigate to **Button Settings**.
2. Create new button entries:
   - Specify a unique **Button Name** (`esp_buttoname`) as this will serve as an alternate key and is essential for referencing the button later.
   - Provide the **Endpoint** and configure required payload and refresh options.
   - Select the button type in the header. Currently supported button types are:
     - **Form**
     - **Grid**
     - **Subgrid**

> **Note:** Associated Views are currently not supported.

![image](https://github.com/user-attachments/assets/217f16b6-9d62-437a-9c30-faf3bab41b75)

### Advanced Button Settings

Once the Button Setting is created, configure additional behavior:

1. Select your button in the subgrid.
2. Click **New Advanced Button Setting** and configure:
   - **Execution Mode** (Sync/Async).
   - **Confirmation Dialogs**, **Spinners**, and various **Notifications**.
   
![image](https://github.com/user-attachments/assets/016d59c2-6b00-4f28-a674-3514d96a33d1)


---

## Registering the Button in the Command Bar Designer or Ribbon Workbench

### Recommended Method: Command Bar Designer

This Low Code Button solution is fully compatible with Dynamics 365's new Command Bar Designer, which is recommended for ease of use and flexibility.

1. **Open Command Bar Designer** within your Dynamics 365 environment.
2. Select the form, grid, or subgrid where the button will be displayed.
3. Add a new command:
   - Reference the provided JavaScript web resource: `LowCodeButtonBase.js` (`esp_/js/LowCodeButtonBase.js`).
   - Always use the function: `LCB.ButtonRegistration.onClick`.

4. Set parameters based on button location:
   - **Form**: Use `PrimaryControl` (formContext) as the first parameter. *(Important: Do NOT use `SelectedControl` for forms.)*
   - **Grid or Subgrid**: Use `SelectedControl` as the first parameter. *(Important: Do NOT use `PrimaryControl` for grids/subgrids.)*

5. Set the second parameter as a string containing the exact **Button Name** (`esp_buttoname`) defined earlier.

### Visibility Rules

Visibility rules can be configured directly in Command Bar Designer using Power Fx formulas without needing any additional JavaScript.

### Alternative Method: Ribbon Workbench

Although the Command Bar Designer is recommended, Low Code Button remains fully compatible with the classic Ribbon Workbench.

---
## Button Payload Behavior

Using **Button Settings**, you can customize the payload to your liking, allowing you to include only the necessary data and exclude unnecessary fields to streamline your button integration.

The payload generated when interacting with buttons varies based on their type (Form or Grid/Subgrid):

### Form Button Payload

Example payload:

```json
{
  "entityLogicalSingularName": "account",
  "entityLogicalPluralName": "accounts",
  "recordId": "b3e1a217-ad08-8191-9023-465306ca391b",
  "userId": "c2f4b618-ad23-7811-b023-9084732ab23f"
}
```

When clicking a button configured for a form, the payload includes:

- **entityLogicalSingularName**: Singular name of the entity.
- **entityLogicalPluralName**: Plural name of the entity.
- **recordId**: ID of the current form record.
- **userId**: ID of the current user triggering the action.

### Grid or Subgrid Button Payload

Example payload for Grid:

```json
{
  "entityLogicalName": "contact",
  "entityLogicalPluralName": "contacts",
  "recordIds": [
    "e2a1b318-bf22-8819-a123-568930bd1234",
    "d2a1c417-bc22-7719-b134-468940be5678"
  ],
  "userId": "c2f4b618-ad23-7811-b023-9084732ab23f"
}
```

Example payload for Subgrid:

```json
{
  "entityLogicalName": "opportunity",
  "entityLogicalPluralName": "opportunities",
  "recordIds": [
    "f4e1d217-cd08-7191-d123-578406ca123c"
  ],
  "userId": "c2f4b618-ad23-7811-b023-9084732ab23f",
  "parentEntityLogicalName": "account",
  "parentEntityLogicalPluralName": "accounts",
  "parentRecordId": "b3e1a217-ad08-8191-9023-465306ca391b"
}
```

For grid or subgrid button clicks, the payload includes:

- **entityLogicalName**: Logical name of the entity from the grid or subgrid.
- **entityLogicalPluralName**: Plural name of the entity.
- **recordIds**: IDs of selected records. It is essential to select at least one record in a grid or subgrid; otherwise, the button click will trigger a default exception, and no POST request will be sent to the API.
- **userId**: ID of the current user triggering the action.

Additionally, subgrid payloads can include:

- **parentEntityLogicalName** and **parentEntityLogicalPluralName**: Details about the parent form.
- **parentRecordId**: ID of the parent record.

These payload configurations help provide context to backend actions, making your integration robust and context-aware.

---

## Response Types

Response types are relevant only for buttons configured with **sync** execution mode. For buttons configured with **async** execution mode, the Low Code Button only checks for DNS issues or incorrect URIs and does not process responses returned by the flow.

The async mode strictly follows the "Fire and Forget" approach. This means the request is initiated without waiting for any response or acknowledgment from the flow. It ensures minimal wait time, optimizing user experience.

Depending on your needs, the Low Code Button supports various types of responses:

### Successful Execution (No Redirect)

If your flow finishes successfully and you do not want any redirect, simply respond with a plain HTTP 200 response.

### Successful Execution with Redirect

If you'd like to offer a user redirect upon successful execution:

- Set your **Sync Confirmation Box Type** to **Redirect** in the advanced button settings.
- Provide the following JSON response from your API:

```json
{
  "redirectUri": "https://www.example.com"
}
```

> **Important:** Ensure your redirect URI includes **https:// or http://**.

### Error Handling

The Low Code Button automatically handles exceptions:

- **5xx Responses:** The user will see the status code and error message directly.
- **Custom Error Handling (400 Response):** To provide your custom error message, respond with:

```json
{
  "title": "Error Title",
  "message": "Something went wrong"
}
```

> The `title` field is optional but recommended for clarity.

---

## Contributing

Contributions are welcome:

1. Fork and branch.
2. Commit clearly.
3. Submit a pull request.

---

## License

Licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA) License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**Why this license?**

1. **Public Accessibility:** Allows the Dynamics 365 community free access and usage.

2. **Professional Usage:** Companies can freely incorporate it into their internal solutions, but cannot commercialize it separately as a paid addon.

3. **Modification and Redistribution:** Others can modify and redistribute your solution freely, provided they attribute your original work and don't commercialize it.

---

## Support

For support, contact:

- **José Martínez Lago**: [LinkedIn](https://www.linkedin.com/in/martinezlago/) | [jose@lago.dev](mailto:jose@lago.dev)
- **Stephan Charles**: [LinkedIn](https://www.linkedin.com/in/stephan-charles-nielson/)