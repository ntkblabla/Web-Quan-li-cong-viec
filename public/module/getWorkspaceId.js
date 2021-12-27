export const getInfoWorkspace = () => {
  const workspaceId = document.getElementById('workspaceId')?.getAttribute('value');
  window.SOLID.store.dispatch('workspaceId', workspaceId);
};
