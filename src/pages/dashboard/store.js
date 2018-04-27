import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import axios from 'axios';

export default class Store {
  @observable loading = false;
  @observable topIcon = 'sun red';
  @observable greeting = '上午好';
  @observable motto = '';
  @observable totalView = 0;
  @observable todayView = 0;
  @observable memory = 0;
  @observable memoryVirtual = 0;
  @observable cpu = 0;
  @observable viewRank;

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
    } else {
      this.topIcon = 'child';
      this.greeting = '加班辛苦了';
    }
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

  @action('获取浏览次数')
  async getViewData() {
    let meta = await axios('api/blog/admin/report');
    meta = meta.data;
    runInAction('set view data', () => {
      if (meta.ret) {
        this.totalView = meta.data.all;
        this.todayView = meta.data.today;
      }
    });
  }

  @action('获取服务器状态')
  async getServerStatus() {
    let meta = await axios('api/blog/admin/server-status');
    meta = meta.data;
    runInAction('set server status', () => {
      if (meta.ret) {
        this.cpu = meta.data.cpu;
        this.memory = (meta.data.mem.private / 1024 / 1024).toFixed(2);
        this.memoryVirtual = (meta.data.mem.virtual / 1024 / 1024).toFixed(0);
      }
    });
  }

  @action('获取浏览数排行')
  async getViewRank() {
    let meta = await axios('api/blog/admin/view-rank');
    meta = meta.data;
    runInAction('set view rank', () => {
      if (meta.ret) {
        this.viewRank = meta.data;
      }
    });
  }

  @action('初始化')
  async init() {
    this.loading = true;
    await this.getTopIconAndContent();
    await this.getMotto();
    await this.getViewData();
    await this.getServerStatus();
    await this.getViewRank();
    this.loading = false;
  }
}
