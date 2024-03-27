/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import type { BrowserWindowConstructorOptions } from 'electron';
// Keeping these updater imports for now in case we add auto-updating in the future
// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';
import { resolveHtmlPath } from './util';
import CONSTANTS from '../constants';

const {
  childXOffset,
  childHeight,
  childWidth,
  awsYOffset,
  ghYOffset,
  mainHeight,
  mainWidth,
  mainXOffset,
  mainYOffset,
} = CONSTANTS;

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let awsWindow: BrowserWindow | null = null;
let ghActionsWindow: BrowserWindow | null = null;
let ghPrWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const childWindowDefaults: BrowserWindowConstructorOptions = {
  frame: false,
  show: false,
  width: childWidth,
  height: childHeight,
  x: childXOffset,
  icon: getAssetPath('icon.png'),
  movable: false,
  parent: mainWindow || undefined,
  webPreferences: {
    devTools: false,
  },
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    x: mainXOffset,
    y: mainYOffset,
    show: false,
    width: mainWidth,
    height: mainHeight,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  awsWindow = new BrowserWindow({
    ...childWindowDefaults,
    y: childHeight + mainHeight,
  });

  ghActionsWindow = new BrowserWindow({
    ...childWindowDefaults,
    y: childHeight * 2 + mainHeight,
  });

  ghPrWindow = new BrowserWindow({
    ...childWindowDefaults,
    y: ghYOffset,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  awsWindow.loadURL('https://travelpassgroup.okta.com/app/UserHome');
  ghPrWindow.loadURL('https://github.com/travelpassgroup/travelpass.com');
  ghActionsWindow.loadURL(
    'https://github.com/travelpassgroup/travelpass.com/actions',
  );

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      awsWindow?.show();
      ghPrWindow?.show();
      ghActionsWindow?.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    awsWindow = null;
  });

  mainWindow.on('will-move', (_, newBounds) => {
    if (process.platform !== 'darwin') {
      const { x, y } = newBounds;
      awsWindow?.setPosition(x + childXOffset, y + childHeight + mainHeight);
      ghPrWindow?.setPosition(x + childXOffset, y + ghYOffset);
      ghActionsWindow?.setPosition(
        x + childXOffset,
        y + childHeight * 2 + mainHeight,
      );
    }
  });

  // TODO: minimize/maximize child windows along with parent

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

ipcMain.on('pr-query', (_, prNumber) => {
  ghPrWindow?.loadURL(
    `https://github.com/travelpassgroup/travelpass.com/pull/${prNumber}`,
  );
});

ipcMain.on('toggle-gh-windows', (_, prState) => {
  if (prState === true) {
    ghActionsWindow?.show();
    ghPrWindow?.show();
    awsWindow?.setBounds({ height: childHeight, y: childHeight + mainHeight });
  } else {
    ghActionsWindow?.hide();
    ghPrWindow?.hide();
    awsWindow?.setBounds({ height: childHeight * 2, y: mainHeight });
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
