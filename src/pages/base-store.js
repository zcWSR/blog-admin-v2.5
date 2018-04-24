import { observable, action } from 'mobx';

export default class BaseStore {
  @observable activeIndex = 0;
  @observable fullscreen = false;

  @action('change active index')
  changeActiveIndex(index) {
    this.activeIndex = index;
  }
}
