import api from '../../../../../api/index.js';

class EditAssign {
  constructor() {
    this.$editAssign = document.querySelector('.edit_assign_task');
    this.$editAssignContent = this.$editAssign.querySelector('.edit_assign_task_content');
    this.$bgClose = this.$editAssign.querySelector('.bg_close_edit_assign_task');
    this.$assignTemp = this.$editAssign.querySelector('.edit_assign_task_item');
    this.$assignWrapper = this.$editAssign.querySelector('.edit_assign_task_wrapper');
    this.$currentAssignEdit = null;
    this.listen();
    this.editTaskData = null;
    this.type = 'add';
  }

  listen() {
    window.SOLID.store.subscribe('OPEN_EDIT_ASSIGN_TASK', (data) => {
      this.editTaskData = data.data;
      this.type = data.type;
      this.$currentAssignEdit = data.dom;
      this.$editAssign.style.display = 'block';
      this.$editAssignContent.style.top = data.top + 35 + 'px';
      this.$editAssignContent.style.left = data.left + 'px';
      const assigners = window.SOLID.store.getState('workspaceMembers');
      this.renderAssign(assigners);
    });
    this.$bgClose.addEventListener('click', () => {
      this.closePopup();
    });
    this.$editAssign.querySelector('.edit_assign_task_item_none').addEventListener('click', () => {
      if (this.type === 'add') {
        this.$currentAssignEdit.setAttribute('value', '');
        this.$currentAssignEdit.querySelector('.icon_add_assigner').style.display = '';
        this.$currentAssignEdit.querySelector('.assigner').style.display = '';
        this.closePopup();
      } else {
        this.clearUserTask(this.editTaskData.id);
        this.closePopup();
      }
    });
  }

  renderAssign(assigners) {
    this.$assignWrapper.innerHTML = '';
    const assignerDoms = [];
    assigners.forEach((member) => {
      const $newMember = this.$assignTemp.cloneNode(true);
      $newMember.style.display = 'flex';
      $newMember.querySelector('.color').innerHTML = member.name[0].toUpperCase();
      $newMember.querySelector('.name').innerHTML = member.name;
      $newMember.addEventListener('click', () => {
        this.update(member);
        this.closePopup();
      });
      assignerDoms.push($newMember);
    });
    this.$assignWrapper.append(...assignerDoms);
  }

  closePopup() {
    this.$editAssign.style.display = '';
  }

  update(member) {
    if (this.type === 'add') {
      this.$currentAssignEdit.setAttribute('value', member.id);
      this.$currentAssignEdit.querySelector('.icon_add_assigner').style.display = 'none';
      this.$currentAssignEdit.querySelector('.assigner').style.display = 'flex';
      this.$currentAssignEdit.querySelector('.assigner').innerHTML = member.name[0].toUpperCase();
    } else {
      this.updateApi(this.editTaskData.id, member.id);
    }
  }

  updateApi(taskId, userId) {
    api({
      url: `tasks/${taskId}/users/${userId}`,
      method: 'POST',
    }).then((res) => {
      if (res.status === 'success') {
        window.SOLID.store.dispatch('TASK_UPDATE', res.result);
        const userTasks = res.result.userTasks;
        this.updateDoms(userTasks);
      }
    });
  }

  clearUserTask(taskId) {
    api({
      url: `tasks/${taskId}/users/clear`,
      method: 'PUT',
    }).then((res) => {
      if (res.status === 'success') {
        const userTasks = res.result.userTasks;
        this.updateDoms(userTasks);
        window.SOLID.store.dispatch('TASK_UPDATE', res.result);
      }
    });
  }

  updateDoms(userTasks) {
    const $usersDom = this.$currentAssignEdit.querySelectorAll('.task_item_assign_value');
    const $assignValue = this.$currentAssignEdit.querySelector('.task_item_assign_value');
    const $assignIcon = this.$currentAssignEdit.querySelector('.task_item_assign_icon');
    $usersDom.forEach(($item) => {
      const id = $item.getAttribute('data-id');
      $item.style.display = 'none';
      if (id) {
        $item.remove();
      }
    });
    if (userTasks?.length) {
      userTasks.forEach((userTask) => {
        const $newAssignValue = $assignValue.cloneNode(true);
        $newAssignValue.style.display = 'flex';
        $newAssignValue.setAttribute('data-id', userTask.id);
        $newAssignValue.innerHTML = userTask.user.name[0].toUpperCase();
        this.$currentAssignEdit.append($newAssignValue);
      });
      $assignIcon.style.display = 'none';
    } else {
      $assignIcon.style.display = '';
    }
  }
}

export default EditAssign;
