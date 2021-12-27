import api from '../../../../../api/index.js';

class EditEstimate {
  constructor() {
    this.$editEstimate = document.querySelector('.edit_estimate_task');
    this.$editEstimateContent = this.$editEstimate.querySelector('.edit_estimate_task_content');
    this.$bgClose = this.$editEstimate.querySelector('.bg_close_edit_estimate_task');
    this.$estimateInput = this.$editEstimate.querySelector('.edit_estimate_task_input');
    this.$saveEstimateBtn = this.$editEstimate.querySelector('.save_estimate_btn');
    this.$currentEstimateEdit = null;
    this.listen();
    this.editTaskData = null;
    this.type = 'add';
  }

  listen() {
    window.SOLID.store.subscribe('OPEN_EDIT_ESTIMATE_TASK', (data) => {
      this.editTaskData = data.data;
      this.type = data.type;
      this.$currentEstimateEdit = data.dom;
      this.$editEstimate.style.display = 'block';
      this.$editEstimateContent.style.top = data.top + 35 + 'px';
      this.$editEstimateContent.style.left = data.left + 'px';
    });
    this.$bgClose.addEventListener('click', () => {
      this.closePopup();
    });
    this.$saveEstimateBtn.addEventListener('click', () => {
      const time = this.$estimateInput.value || 0;
      this.update(time);
      this.closePopup();
    });
  }

  closePopup() {
    this.$editEstimate.style.display = '';
    this.$estimateInput.value = '';
  }

  update(time) {
    if (this.type === 'add') {
      this.$currentEstimateEdit.setAttribute('value', time);
      const $icon = this.$currentEstimateEdit.querySelector('.add_task_estimate_icon');
      const $value = this.$currentEstimateEdit.querySelector('.add_task_estimate_value');
      $icon.style.display = 'none';
      $value.style.display = 'block';
      $value.innerHTML = time + 'h';
    } else {
      const updateData = {
        ...this.editTaskData,
        estimateTime: time,
      };
      this.updateTask(this.editTaskData.id, updateData);
    }
  }

  updateTask(id, task) {
    task.id && delete task.id;
    delete task.process;
    delete task.sprint;
    api({
      url: `tasks/${id}`,
      method: 'PUT',
      body: {
        estimateTime: task.estimateTime,
      },
    }).then((res) => {
      if (res.status === 'success') {
        this.updateToDom(res.result);
        window.SOLID.store.dispatch('TASK_UPDATE', res.result);
      }
    });
  }

  updateToDom(task) {
    const $taskItem = document.querySelector(`.task_item[data-id='${task.id}']`);
    const $estimateValueContent = $taskItem.querySelector('.task_item_estimate_value_content');
    const $estimateIcon = $taskItem.querySelector('.task_item_estimate_icon');
    const $estimateValue = $taskItem.querySelector('.task_item_estimate_value');
    if (task.estimateTime) {
      $estimateValueContent.innerHTML = task.estimateTime;
      $estimateIcon.style.display = '';
      $estimateValue.style.display = '';
    } else {
      $estimateIcon.style.display = 'flex';
      $estimateValue.style.display = 'none';
    }
  }
}

export default EditEstimate;
