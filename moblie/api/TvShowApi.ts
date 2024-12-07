import { APIV1Client } from './APIV1Client';
import config from './config';


async function getTvShow(id: string): Promise<TvShow> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TvShow>(`tv-shows/${id}`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}
async function getTvShows(): Promise<TvShow[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TvShow[]>('tv-shows', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}


export {
  getTvShow,
  getTvShows,
};
