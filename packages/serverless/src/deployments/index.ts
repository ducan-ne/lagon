import path from 'node:path';
import fs from 'node:fs';
import { Deployment } from '@lagon/runtime';

export const DEPLOYMENTS_FOLDER = path.join(path.resolve(), 'dist', 'deployments');

export function deleteOldDeployments(deployments: Deployment[]) {
  const localDeploymentsFiles = fs.readdirSync(DEPLOYMENTS_FOLDER);

  localDeploymentsFiles.forEach(localDeploymentFile => {
    if (!localDeploymentFile.endsWith('.js')) {
      return;
    }

    const localDeploymentId = localDeploymentFile.replace('.js', '');

    if (!deployments.some(deployment => deployment.deploymentId === localDeploymentId)) {
      deleteDeploymentCode({ deploymentId: localDeploymentId } as Deployment);
    }
  });
}

export function hasDeploymentCodeLocally(deployment: Deployment): boolean {
  const file = path.join(DEPLOYMENTS_FOLDER, `${deployment.deploymentId}.js`);

  return fs.existsSync(file);
}

export async function getDeploymentCode(deployment: Deployment): Promise<string> {
  const file = path.join(DEPLOYMENTS_FOLDER, `${deployment.deploymentId}.js`);

  return fs.readFileSync(file, 'utf8');
}

export function writeDeploymentCode(deployment: Deployment, code: string | Buffer): void {
  const file = path.join(DEPLOYMENTS_FOLDER, `${deployment.deploymentId}.js`);

  if (deployment.assets.length > 0) {
    fs.mkdirSync(path.join(DEPLOYMENTS_FOLDER, deployment.deploymentId));
  }

  fs.writeFileSync(file, code, 'utf8');
}

export function getAssetContent(deployment: Deployment, name: string): fs.ReadStream {
  const file = path.join(DEPLOYMENTS_FOLDER, deployment.deploymentId, name);

  return fs.createReadStream(file);
}

export function writeAssetContent(name: string, content: string | Buffer): void {
  const file = path.join(DEPLOYMENTS_FOLDER, name);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function deleteDeploymentCode(deployment: Deployment) {
  const file = path.join(DEPLOYMENTS_FOLDER, `${deployment.deploymentId}.js`);

  try {
    fs.rmSync(file);
    // Folder for assets
    fs.rmSync(path.join(DEPLOYMENTS_FOLDER, deployment.deploymentId), { recursive: true, force: true });
  } catch (e) {
    console.error(e);
  }
}
