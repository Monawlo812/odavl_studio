ext install odavl.odavl-studio

# ODAVL Studio VS Code Extension

<img src="media/odavl.png" alt="ODAVL Studio Logo" width="64" height="64" />

Secure, Self-Healing Code Governance for professional teams. Automate code health, healing, and governance directly inside VS Code.

## Features

- **Scan Project**: Analyze codebase health and hygiene
- **Doctor Mode**: Live visualization of automated fixes and phases
- **Undo/Redo**: Instantly revert or re-apply changes
- **Reports**: View evidence and governance reports

## Screenshots

![Control Center](media/screenshot.png)
![Doctor Mode](media/screenshot-doctor.png)


## How to Build & Install

1. Build the extension:
	```sh
	pnpm --filter @odavl/vscode-ext run build
	```
2. Package as VSIX:
	```sh
	pnpm dlx @vscode/vsce package
	```
3. Install in VS Code:
	```sh
	code --install-extension apps/vscode-ext/*.vsix --force
	```

---
For more, see the main [ODAVL Studio documentation](https://github.com/Monawlo812/odavl_studio).
