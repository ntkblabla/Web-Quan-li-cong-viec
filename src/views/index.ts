import express from 'express';
import path from 'path';
import spaceServices from '../modules/space/services';
import workspaceServices from '../modules/workspace/services';

const router = express.Router();

router.get('/', async (req: any, res) => {
  const workspaceList = await workspaceServices.getWorkspaceByUserId(req?.user?.id);
  if (workspaceList.length) {
    const firstWorkspaceId = workspaceList[0].id;
    return res.redirect(`/workspaces/${firstWorkspaceId}`);
  } else {
    return res.redirect('/create-workspace');
  }
});

router.get('/workspaces/:workspaceId', async (req: any, res) => {
  const workspaceId = req.params.workspaceId;
  const userId = req.user.id;
  const workspace = await workspaceServices.getWorkspaceById(Number(workspaceId), Number(userId));
  const spaceList = await spaceServices.getSpacesByWorkspaceId(Number(workspaceId));
  if (workspace) {
    res.render('home-page/index.ejs', {
      workspace: workspace,
      workspaceDenote: workspace.name[0].toUpperCase(),
      spaceList: spaceList,
    });
  } else {
    res.render('404/index.ejs');
  }
});

router.get('/login', (_req, res) => {
  res.status(200).sendFile(path.resolve(__dirname + '/../../public/views/login-page/index.html'));
});

router.get('/register', (_req, res) => {
  res.status(200).sendFile(path.resolve(__dirname + '/../../public/views/register-page/index.html'));
});

router.get('/create-workspace', (_req, res) => {
  res.status(200).sendFile(path.resolve(__dirname + '/../../public/views/create-workspace-page/index.html'));
});

router.get('/settings/profile.:workspaceId', async (req: any, res) => {
  const user = req.user;
  const workspaceId = req.params.workspaceId;
  const userId = req.user.id;
  delete user.password;
  const workspace = await workspaceServices.getWorkspaceById(Number(workspaceId), Number(userId));
  res.render('settings-page/my-settings/index.ejs', {
    user: user,
    workspace: workspace,
  });
});

router.get('/settings/workspaces/:workspaceId/info', async (req: any, res) => {
  const user = req.user;
  const workspaceId = req.params.workspaceId;
  const workspace = await workspaceServices.getWorkspaceById(workspaceId, user.id);
  res.render('settings-page/workspace-settings/index.ejs', {
    workspace: workspace,
  });
});

router.get('/settings/workspaces/:workspaceId/users', async (req: any, res) => {
  const user = req.user;
  const workspaceId = req.params.workspaceId;
  const workspace = await workspaceServices.getWorkspaceById(workspaceId, user.id);
  res.render('settings-page/users-settings/index.ejs', {
    workspace: workspace,
  });
});

router.get('/notifications', (_req, res) => {
  res.render('notification-page/index.ejs');
});

export default router;
