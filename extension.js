// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cheatsheet" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('cheatSheet.start', function () {
        // The code you place here will be executed every time your command is executed

        const panel = vscode.window.createWebviewPanel(
            'cheatSheet', // Identifies the type of the webview. Used internally
            'Cheat Sheet', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            { enableScripts: true } // Webview options. More on these later.
        );
        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(handleMessage);
    });

    context.subscriptions.push(disposable);
};

const getWebviewContent = () => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cheat Sheet</title>

      <script>
        (function() {
            const vscode = acquireVsCodeApi();

            window.addEventListener('message', (e) => {
                const data = JSON.parse(e.data);
                vscode.postMessage(data);
            });
        }())
      </script>

      <style>
        body {
            height: 100vh;
        }
      </style>
  </head>

  <body>
  <iframe src="https://crazycheatsheetapp.netlify.app/" width="100%" height="100%" frameBorder="0">
  </iframe>
  </body>

  </html>`;
};

const handleMessage = (message) => {
    console.log('Received from webview', message);

    switch (message.action) {
        case 'write-clipboard':
            vscode.env.clipboard.writeText(message.text);
            break;
        default:
            break;
    }
};

// this method is called when your extension is deactivated
const deactivate = () => {};

module.exports = {
    activate,
    deactivate
};
