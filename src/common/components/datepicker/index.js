import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { isFunction, isString } from 'lodash';

const defaultDateFormat = 'YYYY-MM-DD';

let dayseq = 0;

const makeMoment = (val, format) => {
  if (isString(val)) {
    return moment(val, format);
  }
  if (moment.isDate(val) || moment.isMoment(val)) {
    return moment(val);
  }
  return undefined;
};

class DatepickerPanel extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
      currentMonth: moment().startOf('month')
    };
  }

  setText(text) {
    this.setState({ text });
  }

  nextMonth() {
    const max = this.makeMoment(this.props.max);
    const currentMonth = moment(this.state.currentMonth);
    if (max && (max.isBefore(currentMonth, 'month') || max.isSame(currentMonth, 'month'))) {
      return;
    }
    currentMonth.add('1', 'months');
    this.setState({ currentMonth });
  }

  prevMonth() {
    const min = this.makeMoment(this.props.min);
    const currentMonth = moment(this.state.currentMonth);
    if (min && (min.isAfter(currentMonth, 'month') || min.isSame(currentMonth, 'month'))) {
      return;
    }
    currentMonth.add('-1', 'months');
    this.setState({ currentMonth });
  }

  selectDate(entity) {
    if (entity.classNames.indexOf('unselectable') > -1) {
      return;
    }
    const current = moment(this.state.currentMonth);
    current.date(entity.date);
    if (isFunction(this.props.onChange)) {
      this.props.onChange(moment(current).format(this.props.valueFormat));
    }
  }

  isCurrentDay(m) {
    const cur = this.makeMoment(this.props.value);
    return cur ? cur.isSame(m, 'day') : false;
  }

  makeMoment(val) {
    return makeMoment(val, this.props.valueFormat);
  }

  isLimited(m) {
    const min = this.makeMoment(this.props.min);
    const max = this.makeMoment(this.props.max);
    if (min && m.isBefore(min)) {
      return true;
    }
    if (max && m.isAfter(max)) {
      return true;
    }
    return false;
  }

  weekLoop(callback) {
    const startWeekDay = this.props.startWeekDay;
    let i = startWeekDay;
    let count = 0;
    while (count < 7) {
      const goon = callback(i);
      if (goon === false) {
        return;
      }
      count += 1;
      if (i === 6) {
        i = 0;
      }
      i += 1;
    }
  }

  @autobind
  prevJudge() {
    this.switchJudge('prev', 'prevMonth');
  }

  @autobind
  prevAction() {
    this.switchJudgeOver('prev', 'prevMonth');
  }

  @autobind
  prevActionByLeave() {
    this.switchJudgeOver('prev');
  }

  @autobind
  nextJudge() {
    this.switchJudge('next', 'nextMonth');
  }

  @autobind
  nextAction() {
    this.switchJudgeOver('next', 'nextMonth');
  }

  @autobind
  nextActionByLeave() {
    this.switchJudgeOver('next');
  }

  switchJudge(key, callback) {
    const action = () => {
      this[`_actionTimeout_${key}`] = window.setTimeout(() => {
        if (this[`_stopAction_${key}`]) {
          this[`_stopAction_${key}`] = false;
          this[`_actionRunning_${key}`] = false;
          return;
        }
        this[`_actionRunning_${key}`] = true;
        this[callback]();
        action();
      }, this[`_actionInterval_${key}`]);
    };
    window.clearTimeout(this[`_prevJudge_${key}`]);
    window.clearTimeout(this[`_prevJudgeAcc_${key}`]);
    this[`_prevJudge_${key}`] = window.setTimeout(() => {
      this[`_actionInterval_${key}`] = 150;
      action();
    }, 500);
    this[`_prevJudgeAcc_${key}`] = window.setTimeout(() => {
      this[`_actionInterval_${key}`] = 50;
    }, 1000);
  }

  switchJudgeOver(key, callback) {
    window.clearTimeout(this[`_prevJudge_${key}`]);
    window.clearTimeout(this[`_prevJudgeAcc_${key}`]);
    if (this[`_actionRunning_${key}`]) {
      this[`_stopAction_${key}`] = true;
    } else if (callback) {
      this[callback]();
    }
  }

  renderWeek() {
    const entities = [];
    this.weekLoop((i) => {
      const classNames = classnames('two', 'wide', 'column', {
        weekend: i === 0 || i === 6
      });
      entities.push(<div className={classNames} key={`week${i}`}>{this.props.weekDayText[i]}</div>);
    });
    return entities;
  }

  renderDay(entity) {
    dayseq += 1;
    return (
      <div className={entity.classNames} key={`day${dayseq}`} onClick={() => (this.selectDate(entity))}>{entity.date}</div>
    );
  }

  renderDays() {
    const cur = moment(this.state.currentMonth);
    const curMonth = cur.month();
    cur.startOf('month');
    let goon = true;
    const dayRows = [];
    while (goon) {
      const dayEntities = [];
      this.weekLoop((i) => {
        const entity = {
          date: cur.date(),
          classNames: 'two wide column'
        };
        const weekDay = cur.day();
        if (weekDay !== i || curMonth !== cur.month()) {
          entity.date = '';
          dayEntities.push(this.renderDay(entity));
          return;
        }

        entity.classNames = classnames(entity.classNames, {
          weekend: weekDay === 0 || weekDay === 6,
          today: moment().isSame(cur, 'day'),
          unselectable: this.isLimited(cur),
          'current-day': this.isCurrentDay(cur)
        });

        dayEntities.push(this.renderDay(entity));
        cur.add(1, 'days');
      });
      if (curMonth !== cur.month()) {
        goon = false;
      }
      dayRows.push(
        <div className="row days" key={`row${dayRows.length - 1}`}>
          {dayEntities}
        </div>
      );
    }
    return dayRows;
  }

  render() {
    return (
      <div className="ui center aligned padded grid">
        <div className="row control-header">
          <div
            className="three wide column arrow"
            onMouseDown={this.prevJudge}
            onMouseUp={this.prevAction}
            onMouseLeave={this.prevActionByLeave}
          >
            <i className="angle left icon" />
          </div>
          <div className="eight wide column">{this.state.currentMonth.format(this.props.monthDisplayFormat)}</div>
          <div
            className="three wide column arrow"
            onMouseDown={this.nextJudge}
            onMouseUp={this.nextAction}
            onMouseLeave={this.nextActionByLeave}
          >
            <i className="angle right icon" />
          </div>
        </div>
        <div className="row day-names">
          {this.renderWeek()}
        </div>
        {this.renderDays()}
      </div>
    );
  }

}

DatepickerPanel.defaultProps = {
  weekDayText: ['日', '一', '二', '三', '四', '五', '六'],
  startWeekDay: 0,
  format: defaultDateFormat,
  monthDisplayFormat: 'YYYY年MM月'
};

class Datepicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidUpdate() {
    if (this.state.visible) {
      this.onDocumentClickBind = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.onDocumentClickBind);
    } else {
      document.removeEventListener('click', this.onDocumentClickBind);
    }
  }

  onDocumentClick(e) {
    // eslint-disable-next-line
    const dom = ReactDOM.findDOMNode(this);
    if (dom.contains(e.target)) {
      return;
    }
    this.setState({ visible: false });
  }

  @autobind
  onContainerClick(e) {
    // eslint-disable-next-line
    const dom = ReactDOM.findDOMNode(this.panel);
    if (dom === e.target || dom.contains(e.target)) {
      return;
    }
    this.setState({ visible: !this.state.visible });
  }

  @autobind
  onChange(value) {
    this.setState({ visible: false });
    if (isFunction(this.props.onChange)) {
      this.props.onChange(value);
    }
  }

  render() {
    const { min, max, valueFormat, value, displayFormat, style, disabled } = this.props;
    const clz = classnames('ui selection dropdown', { disabled });
    let placeholder = (<div className="default text">{this.props.placeholder}</div>);
    if (value) {
      const curMoment = makeMoment(value, valueFormat);
      const dataText = curMoment ? curMoment.format(displayFormat) : '';
      placeholder = (<div className="text">{dataText}</div>);
    }

    let panelWrapperClass = 'ui fluid popup bottom left transition datepicker-panel-wrap';
    const panelWrapperStyle = {};
    if (this.state.visible) {
      panelWrapperClass += ' visible';
      panelWrapperStyle.left = 0;
      panelWrapperStyle.top = 36;
    }

    const panelConfig = {
      min,
      max,
      onChange: this.onChange,
      ref: (dom) => { this.panel = dom; },
      valueFormat,
      value
    };

    return (
      <div className={clz} onClick={this.onContainerClick} style={style}>
        <i className="calendar icon" />
        {placeholder}
        <div className={panelWrapperClass} style={panelWrapperStyle}>
          <DatepickerPanel {...panelConfig} />
        </div>
      </div>
    );
  }

}

Datepicker.defaultProps = {
  valueFormat: defaultDateFormat,
  displayFormat: defaultDateFormat,
  placeholder: '请选择日期',
  style: {
    position: 'relative', zIndex: 3, minWidth: 0
  }
};


export default Datepicker;
