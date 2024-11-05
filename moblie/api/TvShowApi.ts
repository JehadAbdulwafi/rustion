import { APIV1Client } from './APIV1Client';


async function getTvShow(id: string): Promise<TvShow> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TvShow>(`tv-shows/${id}`, { method: 'GET' });
  return res
}
async function getTvShows(): Promise<TvShow[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TvShow[]>('tv-shows', { method: 'GET' });
  return res
}


export {
  getTvShow,
  getTvShows,
};
