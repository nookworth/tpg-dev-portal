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
  minimizable: true,
  show: false,
  width: childWidth,
  height: childHeight,
  x: childXOffset,
  icon: getAssetPath('icon.png'),
  movable: false,
  hiddenInMissionControl: true,
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
    parent: mainWindow,
    y: childHeight + mainHeight,
    ...childWindowDefaults,
  });

  ghActionsWindow = new BrowserWindow({
    parent: mainWindow,
    y: childHeight * 2 + mainHeight,
    ...childWindowDefaults,
  });

  ghPrWindow = new BrowserWindow({
    parent: mainWindow,
    y: ghYOffset,
    ...childWindowDefaults,
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

ipcMain.on('check-branch', (_, branch) => {
  switch (branch) {
    case 'master':
      return awsWindow?.webContents.findInPage('https://int.travelpass.com');
    case 'stg':
      return awsWindow?.webContents.findInPage('https://stg.travelpass.com');
    case 'prod':
      return awsWindow?.webContents.findInPage('https://travelpass.com');
    default:
      awsWindow?.webContents.findInPage('https://int.travelpass.com');
  }
});

ipcMain.on('pr-query', (_, prNumber) => {
  ghPrWindow?.loadURL(
    `https://github.com/travelpassgroup/travelpass.com/pull/${prNumber}`,
  );
});

ipcMain.on('set-aws-step', (_, stepNumber) => {
  if (stepNumber === 0) {
    awsWindow?.loadURL('https://travelpassgroup.okta.com/app/UserHome');
  }
  if (stepNumber === 1) {
    awsWindow?.loadURL('https://d-9267487623.awsapps.com/start#/');
  }
  if (stepNumber === 2) {
    awsWindow?.loadURL(
      'https://d-9267487623.awsapps.com/start/#/saml/custom/361429333791%20%28TravelPass%20Group%20Production%29/MDQ3OTE0ODUzNzA4X2lucy1hZjdkZmMxZDk2MWI4NzhlX3AtM2FlZTA3Zjk5NGRjOWEyMg%3D%3D',
    );
    awsWindow?.webContents?.addListener('found-in-page', () => {
      awsWindow?.webContents?.stopFindInPage('clearSelection');
    });
  }
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
    mainWindow?.on('minimize', () => {
      const children = mainWindow?.getChildWindows();
      console.log('children: ', children);
      children?.forEach((child) => child.minimize());
    });
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
