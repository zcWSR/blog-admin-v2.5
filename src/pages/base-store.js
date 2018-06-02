import { observable, action } from 'mobx';
import cookie from 'tiny-cookie';

export default class BaseStore {
  constructor() {
    this.changeUsername(cookie.get('username'));
  }

  @observable activeIndex = 0;
  @observable fullscreen = false;
  @observable username = '';

  @action('change active index')
  changeActiveIndex(index) {
    this.activeIndex = index;
  }

  @action('change user name')
  changeUsername(username) {
    this.username = username;
  }

}
