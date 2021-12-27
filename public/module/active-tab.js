export const activeContent = ($title) => {
  const $currentActive = document.querySelector('.active_content_main');
  if ($currentActive) {
    $currentActive.classList.remove('active_content_main');
  }
  $title.classList.add('active_content_main');
};
