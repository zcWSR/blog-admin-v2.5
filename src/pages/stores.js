import DbStore from './dashboard/store';
import BaseStore from './base-store';


export default routing => ({
  routing,
  base: new BaseStore(),
  dashboard: new DbStore()
});
