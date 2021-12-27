import FolderItem from '../folder-item/folder-item.js';

class SpaceItem {
  constructor($space) {
    // attribute
    this.$spaceWrapper = document.querySelector('.space_wrapper');
    this.$spaceOptions = this.$spaceWrapper.querySelector('.space_options');
    this.$space = $space;
    this.spaceId = $space.getAttribute('data-id');
    // init methods
    this.toggleSpaceOptions();
    // init folder scripts
    this.initFolderScript();
  }

  toggleSpaceOptions() {
    const $actionsSpace = this.$space.querySelector('.actions_space');
    const $openSpaceOptionsBtn = this.$space.querySelector('.open_space_options');
    $openSpaceOptionsBtn.addEventListener('click', () => {
      $actionsSpace.style.display = 'flex';
      $actionsSpace.classList.add('active');
      const relativePos = this.$space.getBoundingClientRect();
      const spaceWidth = this.$space.offsetWidth;
      this.$spaceOptions.style.display = 'block';
      const $spaceOptionsContent = this.$spaceOptions.querySelector('.space_options_content');
      $spaceOptionsContent.style.top = relativePos.top + 30 + 'px';
      $spaceOptionsContent.style.left = relativePos.left + spaceWidth - 20 + 'px';
      window.SOLID.store.dispatch('OPEN_SPACE_OPTIONS', this.spaceId);
    });
  }

  initFolderScript() {
    const $folderItems = this.$space.querySelectorAll('.folder');
    $folderItems.forEach(($item) => {
      new FolderItem($item);
    });
  }
}

export default SpaceItem;
