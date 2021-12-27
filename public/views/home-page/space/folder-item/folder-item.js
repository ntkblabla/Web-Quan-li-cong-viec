import { activeContent } from '../../../../module/active-tab.js';
import SprintItem from '../sprint-item/sprint-item.js';

class FolderItem {
  constructor($folder) {
    this.$folder = $folder;
    this.folderId = this.$folder.getAttribute('data-id');
    this.$spaceWrapper = document.querySelector('.space_wrapper');
    this.$folderOptions = this.$spaceWrapper.querySelector('.folder_options');
    this.$sprintList = this.$folder.querySelector('.sprint_list');
    this.toggleSprint();
    this.toggleFolderOptions();
    this.listenActive();
    this.initSprintScript();
  }

  toggleSprint() {
    const $titleName = this.$folder.querySelector('.title_name');
    $titleName.addEventListener('click', () => {
      const sprintListDisplay = this.$sprintList.style.display;
      if (!sprintListDisplay || sprintListDisplay === 'none') {
        this.$sprintList.style.display = 'block';
        $titleName.querySelector('.toggle_icon').style.transform = 'rotate(0deg)';
      } else {
        this.$sprintList.style.display = '';
        $titleName.querySelector('.toggle_icon').style.transform = 'rotate(-90deg)';
      }
    });
  }

  toggleFolderOptions() {
    const $actionsFolder = this.$folder.querySelector('.actions_folder');
    const $openSpaceOptionsBtn = this.$folder.querySelector('.open_folder_options');
    $openSpaceOptionsBtn.addEventListener('click', () => {
      $actionsFolder.style.display = 'flex';
      $actionsFolder.classList.add('active');
      const relativePos = this.$folder.getBoundingClientRect();
      const folderWidth = this.$folder.offsetWidth;
      this.$folderOptions.style.display = 'block';
      const $folderOptionsContent = this.$folderOptions.querySelector('.folder_options_content');
      $folderOptionsContent.style.top = relativePos.top + 30 + 'px';
      $folderOptionsContent.style.left = relativePos.left + folderWidth - 20 + 'px';
      const folderList = window.SOLID.store.getState('folderList');
      const folderActive = folderList.find((folder) => +folder.id === +this.folderId);
      window.SOLID.store.dispatch('OPEN_FOLDER_OPTIONS', {
        folderId: this.folderId,
        sprintLength: folderActive?.sprints?.length,
      });
    });
  }

  listenActive() {
    const $title = this.$folder.querySelector('.title');
    $title.addEventListener('click', () => {
      activeContent($title);
      window.SOLID.store.dispatch('activeContent', {
        id: this.folderId,
        type: 'folder',
      });
    });
  }

  initSprintScript() {
    const $sprintItems = this.$folder.querySelectorAll('.sprint_item');
    $sprintItems.forEach(($item) => {
      new SprintItem($item);
    });
  }
}

export default FolderItem;
