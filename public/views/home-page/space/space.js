class Space {
  constructor() {
    // attribute
    this.$spaceWrapper = document.querySelector('.space_wrapper');
    this.$spaceOptions = this.$spaceWrapper.querySelector('.space_options');
    this.$folderOptions = this.$spaceWrapper.querySelector('.folder_options');
    // init methods
    this.spaceActiveId = 0;
    this.folderActiveId = 0;
    this.listenSpaceId();
    this.toggleSpaceOptions();
    this.openCreateFolderPopup();
    // folder options
    this.listenFolderId();
    this.toggleFolderOptions();
    this.openCreateSprintPopup();
  }

  // space options
  toggleSpaceOptions() {
    const $closeOptions = this.$spaceOptions.querySelector('.bg_close_space_options');
    $closeOptions.addEventListener('click', () => {
      this.closePopupSpaceOptions();
    });
    const $spaceOptionsItems = this.$spaceOptions.querySelectorAll('.space_options_item');
    $spaceOptionsItems.forEach(($item) => {
      $item.addEventListener('click', () => {
        this.closePopupSpaceOptions();
      });
    });
  }

  openCreateFolderPopup() {
    const $createNewFolderBtn = this.$spaceOptions.querySelector('.create_new_folder ');
    $createNewFolderBtn.addEventListener('click', () => {
      window.SOLID.store.dispatch('OPEN_CREATE_FOLDER_POPUP', this.spaceActiveId);
    });
  }

  closePopupSpaceOptions() {
    const $actionsSpace = this.$spaceWrapper.querySelector('.actions_space.active');
    $actionsSpace.style.display = '';
    $actionsSpace.classList.remove('active');
    this.$spaceOptions.style.display = 'none';
  }

  listenSpaceId() {
    window.SOLID.store.subscribe('OPEN_SPACE_OPTIONS', (id) => {
      this.spaceActiveId = id;
    });
  }
  // folder options
  listenFolderId() {
    window.SOLID.store.subscribe('OPEN_FOLDER_OPTIONS', (id) => {
      this.folderActiveId = id;
    });
  }

  toggleFolderOptions() {
    const $closeOptions = this.$folderOptions.querySelector('.bg_close_folder_options');
    $closeOptions.addEventListener('click', () => {
      this.closePopupFolderOptions();
    });
    const $spaceOptionsItems = this.$folderOptions.querySelectorAll('.folder_options_item');
    $spaceOptionsItems.forEach(($item) => {
      $item.addEventListener('click', () => {
        this.closePopupFolderOptions();
      });
    });
  }

  closePopupFolderOptions() {
    const $actionsFolder = this.$spaceWrapper.querySelector('.actions_folder.active');
    $actionsFolder.style.display = '';
    $actionsFolder.classList.remove('active');
    this.$folderOptions.style.display = 'none';
  }

  openCreateSprintPopup() {
    const $createNewSprintBtn = this.$folderOptions.querySelector('.create_new_sprint');
    $createNewSprintBtn.addEventListener('click', () => {
      window.SOLID.store.dispatch('OPEN_CREATE_SPRINT_POPUP', this.folderActiveId);
    });
  }
}

export default Space;
