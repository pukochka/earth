import { contextBridge } from 'electron';
import { dialog } from '@electron/remote';

contextBridge.exposeInMainWorld('electronApi', {
  openFileDialog: async (title: any, folder: any, filters: any) => {
    const response = await dialog.showOpenDialog({
      title,
      filters,
      properties: ['openFile', 'multiSelections'],
    });
    return response.filePaths;
  },
});
