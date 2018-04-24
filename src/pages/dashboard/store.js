import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import axios from 'axios';

export default class Store {
  @observable topIcon = 'sun red';
  @observable greeting = '上午好';
  @observable motto = '';

  @action('获取顶部图标和文本')
  getTopIconAndContent() {
    const current = moment();
    let currentHour = current.hour();
    const currentMinute = current.minute();
    if (currentMinute > 20) {
      currentHour += 1;
    }
    if (currentHour >= 8 && currentHour <= 11) {
      this.topIcon = 'sun red';
      this.greeting = '上午好';
    } else if (currentHour >= 12 && currentHour <= 14) {
      this.topIcon = 'sun red';
      this.greeting = '中午好';
    } else if (currentHour >= 15 && currentHour <= 18) {
      this.topIcon = 'cloud blue';
      this.greeting = '下午好';
    } else if (currentHour >= 19 && currentHour <= 20) {
      this.topIcon = 'moon';
      this.greeting = '晚上好';
    }
    this.topIcon = 'child';
    this.greeting = '加班辛苦了';
  }

  @action('获取随机名言')
  async getMotto() {
    let meta = await axios('/api/blog/admin/motto');
    meta = meta.data;
    runInAction('set motto', () => {
      if (meta.ret) {
        this.motto = meta.data;
      }
    });
  }

  init() {
    this.getTopIconAndContent();
    this.getMotto();
  }
}
