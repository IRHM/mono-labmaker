import LabmakerAPI from 'labmaker-api-wrapper';

export const Labmaker = new LabmakerAPI(import.meta.env.REACT_APP_APIURL!, {
  debug: true,
  logFullErr: true,
});
