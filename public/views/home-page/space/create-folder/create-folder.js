import api from '../../../../api/index.js';
import openNotification from '../../../../module/notification.js';
import FolderItem from '../folder-item/folder-item.js';

class CreateFolder {
  constructor() {
    this.$spaceTemp = document.querySelector('.space_template');
    this.$folderItemTemp = this.$spaceTemp.querySelector('.folder_item_temp').querySelector('.folder');
    this.$popup = document.querySelector('.create_folder_popup');
    this.listen();
    this.close();
    this.createFolder();
    this.spaceId = 0;
  }

  listen() {
    window.SOLID.store.subscribe('OPEN_CREATE_FOLDER_POPUP', (spaceId) => {
      this.$popup.style.display = 'flex';
      this.spaceId = spaceId;
    });
  }

  close() {
    const $bgClose = this.$popup.querySelector('.bg_close_popup');
    $bgClose.addEventListener('click', () => {
      this.closePopup();
    });
    const $closebtn = this.$popup.querySelector('.close_icon');
    $closebtn.addEventListener('click', () => {
      this.closePopup();
    });
  }

  closePopup() {
    this.$popup.style.display = '';
  }

  createFolder() {
    const $btnSubmit = this.$popup.querySelector('.create_folder_btn');
    $btnSubmit.addEventListener('click', (e) => {
      const folderName = this.$popup.querySelector('.name_folder ').value;
      if (folderName) {
        e.preventDefault();
        this.callApi(folderName);
      }
    });
  }

  callApi(folderName) {
    api({
      url: `spaces/${this.spaceId}/folders`,
      method: 'POST',
      body: {
        name: folderName,
      },
    }).then((res) => {
      if (res.status === 'success') {
        this.appendFolderToDom(res.result);
        // update store
        const currentFolderList = window.SOLID.store.getState('folderList');
        window.SOLID.store.dispatch('folderList', [...currentFolderList, { ...res.result, sprints: [] }]);
        //
        this.closePopup();
        this.$popup.querySelector('.name_folder ').value = '';
        openNotification('success', 'Create folder success!');
      } else {
        openNotification('error', res.message);
      }
    });
  }

  appendFolderToDom(folder) {
    const $newFolder = this.$folderItemTemp.cloneNode(true);
    $newFolder.style.display = 'block';
    $newFolder.setAttribute('data-id', folder.id);
    const $folderName = $newFolder.querySelector('.folder_name');
    $folderName.innerHTML = folder.name;
    const $spaceDoms = document.querySelector(`.space[data-id='${this.spaceId}']`);
    const $folderWrapper = $spaceDoms.querySelector('.folder_wrapper');
    new FolderItem($newFolder);
    $folderWrapper.append($newFolder);
  }
}

export default CreateFolder;
