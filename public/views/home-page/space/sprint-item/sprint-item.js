import { activeContent } from '../../../../module/active-tab.js';

class SprintItem {
  constructor($sprint) {
    this.$sprint = $sprint;
    this.sprintId = this.$sprint.getAttribute('data-id');
    this.listenActive();
  }

  listenActive() {
    this.$sprint.addEventListener('click', () => {
      activeContent(this.$sprint);
      window.SOLID.store.dispatch('activeContent', {
        id: this.sprintId,
        type: 'sprint',
      });
    });
  }
}

export default SprintItem;
