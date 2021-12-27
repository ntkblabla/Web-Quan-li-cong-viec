class TaskSprint {
  constructor($sprint, sprint) {
    this.$sprint = $sprint;
    this.$createNewTaskBtn = this.$sprint.querySelector('.create_new_task_commom');
    this.$addTask = this.$sprint.querySelector('.add_task_common');
    this.sprint = sprint;
    this.listenOpenCreateTask();
  }

  listenOpenCreateTask() {
    this.$createNewTaskBtn.addEventListener('click', () => {
      this.$addTask.style.display = 'block';
    });
  }
}

export default TaskSprint;
