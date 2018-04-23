import { observable } from 'mobx';

export default class BaseStore {
  @observable activeIndex = 0;
}
