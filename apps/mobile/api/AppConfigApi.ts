import { APIV1Client } from './APIV1Client';
import config from './config';

async function getAppConfig(): Promise<AppConfig> {
    const api = new APIV1Client();
    const res = await api.sendUnauthenticatedApiV1Request<AppConfig>(`apps/${config.app.id}`, { method: 'GET' });
    return res
}

export {
    getAppConfig,
};
