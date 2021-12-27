import api from '../../../../api/index.js';
import { formatDate } from '../../../../module/day.js';

class TaskItem {
  constructor($taskItem, task, process) {
    this.$taskItem = $taskItem;
    this.process = process;
    this.task = task;
    this.$taskItem.style.display = 'flex';
    this.$taskItem.setAttribute('data-id', task.id);
    this.$status = this.$taskItem.querySelector('.task_item_status');
    this.$title = this.$taskItem.querySelector('.task_item_title');
    this.$assign = this.$taskItem.querySelector('.task_item_assign');
    this.$dueDate = this.$taskItem.querySelector('.task_item_duedate');
    this.$dueDateInput = this.$taskItem.querySelector('.task_item_due_date_input');
    this.$inputDate = this.$taskItem.querySelector('.due_date_input');
    this.$assignValue = this.$assign.querySelector('.task_item_assign_value');
    this.$assignIcon = this.$assign.querySelector('.task_item_assign_icon');
    this.$estimate = this.$taskItem.querySelector('.task_item_estimate');
    this.$estimateValueContent = this.$taskItem.querySelector('.task_item_estimate_value_content');
    this.$estimateIcon = this.$taskItem.querySelector('.task_item_estimate_icon');
    this.$estimateValue = this.$taskItem.querySelector('.task_item_estimate_value');
    this.renderTaskItem(task, process);
    // change date
    this.addEventChangeDate(this.$inputDate, task);
    // change estimate
    this.addEventChangeEstimate(this.$estimate, task);
    // change assing
    this.addEventChangeAssign(this.$assign, task);
    // listen task update
    this.listenTaskUpdate();

    // open detail
    this.addEventOpenTaskDetail(this.$taskItem, task);
  }

  renderTaskItem(task, process) {
    // change status
    this.$status.setAttribute('value', process.id);
    this.$status.style.backgroundColor = process.color;
    this.addEventChangeStatus(this.$status, task);
    // title
    this.$title.innerHTML = task.title;
    // assign
    const userTasks = task.userTasks;
    const $usersDom = this.$assign.querySelectorAll('.task_item_assign_value');
    $usersDom.forEach(($item) => {
      const id = $item.getAttribute('data-id');
      $item.style.display = 'none';
      if (id) {
        $item.remove();
      }
    });
    if (userTasks?.length) {
      userTasks.forEach((userTask) => {
        const $newAssignValue = this.$assignValue.cloneNode(true);
        $newAssignValue.style.display = 'flex';
        $newAssignValue.setAttribute('data-id', userTask.id);
        $newAssignValue.innerHTML = userTask.user.name[0].toUpperCase();
        this.$assign.append($newAssignValue);
      });
      this.$assignIcon.style.display = 'none';
    } else {
      this.$assignIcon.style.display = '';
    }
    // update date
    if (task.dueDate) {
      this.$dueDate.innerHTML = formatDate(task.dueDate);
      if (new Date().getTime() > new Date(task.dueDate)) {
        this.$dueDate.classList.add('color_red');
      } else {
        this.$dueDate.classList.remove('color_red');
      }
    } else {
      this.$dueDate.style.display = 'none';
      this.$dueDateInput.style.display = 'flex';
    }
    // estimate
    if (task.estimateTime) {
      this.$estimateValueContent.innerHTML = task.estimateTime || 0;
      this.$estimateIcon.style.display = '';
      this.$estimateValue.style.display = '';
    } else {
      this.$estimateIcon.style.display = 'flex';
      this.$estimateValue.style.display = 'none';
    }
  }

  addEventChangeDate($inputDate, task) {
    $inputDate.addEventListener('change', (e) => {
      this.$dueDate.style.display = '';
      this.$dueDate.innerHTML = formatDate(e.target.value);
      if (new Date().getTime() > new Date(e.target.value)) {
        this.$dueDate.classList.add('color_red');
      } else {
        this.$dueDate.classList.remove('color_red');
      }
      this.$dueDateInput.style.display = '';
      const data = {
        dueDate: new Date(e.target.value),
      };
      this.updateTask(task.id, data);
    });
  }

  addEventOpenTaskDetail($taskItem, taskData) {
    $taskItem.querySelector('.task_item_title').addEventListener('click', () => {
      const data = {
        ...taskData,
      };
      window.SOLID.store.dispatch('OPEN_TASK_DETAIL', data);
    });
  }

  addEventChangeStatus($status, task) {
    $status.addEventListener('click', () => {
      const relativePos = $status.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_STATUS_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: $status,
        type: 'edit',
        data: task,
      });
    });
  }

  addEventChangeEstimate($estimate, task) {
    $estimate.addEventListener('click', () => {
      const relativePos = $estimate.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_ESTIMATE_TASK', {
        top: relativePos.top,
        left: relativePos.left - 30,
        dom: $estimate,
        type: 'edit',
        data: task,
      });
    });
  }

  addEventChangeAssign($assign, task) {
    $assign.addEventListener('click', () => {
      const relativePos = $assign.getBoundingClientRect();
      window.SOLID.store.dispatch('OPEN_EDIT_ASSIGN_TASK', {
        top: relativePos.top,
        left: relativePos.left,
        dom: $assign,
        type: 'edit',
        data: task,
      });
    });
  }

  updateTask(id, task) {
    task.id && delete task.id;
    delete task.process;
    delete task.sprint;
    api({
      url: `tasks/${id}`,
      method: 'PUT',
      body: task,
    }).then((res) => {
      if (res.status === 'success') {
        console.log('update: ', res.result);
      }
    });
  }

  listenTaskUpdate() {
    window.SOLID.store.subscribe('TASK_UPDATE', (data) => {
      if (data.id === this.task.id) {
        this.task = data;
        this.renderTaskItem(this.task, this.task.process);
      }
    });
  }
}

export default TaskItem;
