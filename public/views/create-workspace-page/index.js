import api from '../../api/index.js';
import { checkToken } from '../../module/checkAuth.js';
import openNotification from '../../module/notification.js';

var stage = 'name-stage';
var colorWorkspace = '#7b68ee';
var nameWorkspace = '';

window.onload = function () {
  checkToken();
  checkStage(stage);
  addEventNextToColorStage();
  addEventBackToNameStage();
};

const checkStage = (stage) => {
  hiddenAllStage();
  switch (stage) {
    case 'name-stage': {
      const $createNameStage = document.getElementsByClassName('create_name')[0];
      $createNameStage.style.display = 'block';
      break;
    }
    case 'color-stage': {
      const $createColorStage = document.getElementsByClassName('create_color')[0];
      $createColorStage.style.display = 'block';
      getColorWorkspace();
      onSubmitCreateWorkspace();
      break;
    }
  }
};

const hiddenAllStage = () => {
  const $createNameStage = document.getElementsByClassName('create_name')[0];
  const $createColorStage = document.getElementsByClassName('create_color')[0];
  $createNameStage.style.display = 'none';
  $createColorStage.style.display = 'none';
};

const addEventNextToColorStage = () => {
  const $nextToColorBtn = document.getElementsByClassName('next_to_color_button ')[0];
  $nextToColorBtn.addEventListener('click', (e) => {
    if (getNameWorkspace()) {
      e.preventDefault();
      stage = 'color-stage';
      checkStage(stage);
    }
  });
};

const addEventBackToNameStage = () => {
  const $nextToColorBtn = document.getElementsByClassName('back_to_name_button ')[0];
  $nextToColorBtn.addEventListener('click', () => {
    stage = 'name-stage';
    checkStage(stage);
  });
};

// get name workspace
const getNameWorkspace = () => {
  const $inputName = document.querySelector("input[name='workspace']");
  const value = $inputName.value;
  if (!value) {
    openNotification('Error', 'Please enter name of workspace!');
    return false;
  }
  nameWorkspace = value;
  return true;
};

// get color workspace
const getColorWorkspace = () => {
  const $colorWorkspaceActive = document.getElementsByClassName('color_workspace_active')[0];
  const $colors = document.getElementsByClassName('color_picker');
  // init color
  $colorWorkspaceActive.querySelector('span').innerHTML = nameWorkspace[0].toUpperCase();
  $colorWorkspaceActive.style.backgroundColor = colorWorkspace;
  const $initColorPicker = document.querySelector(`.color_picker[value="${colorWorkspace}"]`);
  $initColorPicker.classList.add('active');
  // event listen change color
  for (let i = 0; i < $colors.length; i++) {
    const $colorPicker = $colors[i];
    $colorPicker.addEventListener('click', () => {
      const $activeColorPicker = document.querySelector('.color_item.active');
      $activeColorPicker && $activeColorPicker.classList.remove('active');
      colorWorkspace = $colorPicker.getAttribute('value');
      $colorWorkspaceActive.style.backgroundColor = colorWorkspace;
      $colorPicker.classList.add('active');
    });
  }
};

// create workspace
const onSubmitCreateWorkspace = () => {
  const $submitBtn = document.getElementsByClassName('create_workspace_btn')[0];
  $submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    api({
      url: 'workspaces',
      method: 'POST',
      body: {
        name: nameWorkspace,
        color: colorWorkspace,
      },
    }).then((res) => {
      if (res.status === 'success') {
        openNotification('success', 'Create workspace success');
        setTimeout(() => {
          window.location.href = `/workspaces/${res.result.id}`;
        }, 500);
      } else {
        openNotification('error', res.message);
      }
    });
  });
};
