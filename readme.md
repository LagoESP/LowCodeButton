# Low Code Button Documentation

## Overview

Low Code Button (LCB) is a lightweight and customizable tool designed to empower Developers, Consultants, and Citizen Developers to easily bridge Dynamics 365 Ribbon Bar buttons to Power Automate flows. This managed solution provides an intuitive interface, enabling the seamless integration and management of interactive buttons directly within your Dynamics 365 environment.

Watch the demo [here](https://youtu.be/fgtiu2bTYZk).

---

## Key Benefits

- **Empowerment:** Allows Developers, Consultants, and Citizen Developers to independently configure button integrations without extensive coding.
- **Flexibility:** Supports various button types, execution modes, and dynamic payloads.
- **Integration:** Seamlessly connects Dynamics 365 Ribbon Bar to Power Automate.

---

## Installation and Setup

### Download and Import

1. **Download the latest managed solution** from the [releases section](https://github.com/LagoESP/LowCodeButton/releases).

2. **Import the solution** into Dynamics 365:

- Navigate to [make.powerapps.com](https://make.powerapps.com), then Solutions, and import.

### Security Roles

- **LowCodeButtonMaker:** Full permissions for button configuration.
- **LowCodeButtonUser:** Read-only access for end users.

---

## Configuring Buttons in LCB Settings App

### Languages

1. Open the **LCB (Low Code Button) Settings** app.
2. Create language entries:
   - Add languages with unique LCID (`esp_lcid`).

![Languages Setup](https://github.com/user-attachments/assets/b7f1b7d8-0bad-4cf1-a81a-f38a31bde474)

### Button Settings

1. Navigate to **Button Settings**.
2. Define new button entries:
   - Specify a unique **Button Name** (`esp_buttoname`).
   - Configure the endpoint, payload, and button type (Form, Grid, Subgrid).

> **Note:** Associated Views are not supported.

**⚠️ Important:** Ensure the **Button Location** selected in the Button Setting form matches the button location in the Ribbon Bar. If you require buttons for multiple locations (form, grid, subgrid), you must register separate buttons for each location.

![Button Settings](https://github.com/user-attachments/assets/217f16b6-9d62-437a-9c30-faf3bab41b75)

### Advanced Settings

Configure additional behaviors like execution modes, confirmation dialogs, spinners, and notifications in **Advanced Button Settings**.

![Advanced Settings](https://github.com/user-attachments/assets/016d59c2-6b00-4f28-a674-3514d96a33d1)

---

## Ribbon Integration

### Command Bar Designer (Recommended)

1. Use **Command Bar Designer** in Dynamics 365.
2. Select the desired location (form/grid/subgrid).
3. Add new commands:
   - Use `LowCodeButtonBase.js` (`esp_/js/LowCodeButtonBase.js`).
   - Invoke `LCB.ButtonRegistration.onClick` function.
4. Parameters:
   - Forms: Use `PrimaryControl`.
   - Grid/Subgrid: Use `SelectedControl`.
   - Button name as the second parameter.

### Visibility Rules

Configure using Power Fx formulas directly in Command Bar Designer.

### Ribbon Workbench (Alternative)

LCB remains compatible with Ribbon Workbench, though Command Bar Designer is recommended.

---

## Payload Customization

Customize button payloads to include only necessary data. Preview payloads with *Show Example Payload* to copy-paste them to the HTTP Trigger connector in Power Automate, enabling you to use Dynamic Content in your flows.

- **Form Payload:** Includes entity names, record ID, and user ID.
- **Grid/Subgrid Payload:** Includes entity names, record IDs, user ID, and optionally, parent entity details.

---

## Response Types

For **sync** buttons:

- **Success without Redirect:** Respond with HTTP 200.
- **Success with Redirect:** Respond with:

```json
{
  "redirectUri": "https://example.com"
}
```

- **Error Handling:**

```json
{
  "title": "Error Title",
  "message": "Detailed error message"
}
```

**Async** mode follows a "Fire and Forget" approach without processing responses.

---

## Contributing

Contributions are welcomed:

1. Fork and branch the repository.
2. Clearly commit changes.
3. Submit a pull request.

---

## License

Licensed under [Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)](https://creativecommons.org/licenses/by-nc-sa/4.0/).

---

## Support

Contact us for support:

- **José Martínez Lago**: [LinkedIn](https://www.linkedin.com/in/martinezlago/) | [jose@lago.dev](mailto:jose@lago.dev)
- **Stephan Charles**: [LinkedIn](https://www.linkedin.com/in/stephan-charles-nielson/)

