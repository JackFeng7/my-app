import React, {PureComponent} from 'react';
import { Line } from '@ant-design/charts';
import {Empty, Select} from 'antd';
import moment from 'moment';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = ONE_DAY * 7;

const { Option } = Select;
export default class LineChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
          currentMode: 'day',
          data: this.formatData()
        };
    }

    getWeekOfYear = (date) => {
      const year = moment(date).year();
      const yearStart = moment([year, 0, 1]).valueOf();
      const yearStartWeek = moment([year, 0, 1]).weekday();

      const yearFirstWeekEnd = yearStart + ((7 - yearStartWeek) * ONE_DAY);

      const dataValue = moment(date).valueOf();

      if (dataValue < yearFirstWeekEnd) {
        return 1;
      }
      return Math.floor((dataValue - yearFirstWeekEnd) / ONE_WEEK) + 2;
    }

    getMonthOfYear = (date) => {
      return moment(date).month() + 1;
    };

    getWeekEnd = (date) => {
      const weekDay = moment(date).weekday();
      const dateValue = moment(date).valueOf();
      return dateValue + ((7 - weekDay - 1) * ONE_DAY);
    };

    getMonthEnd = (date) => {
      const year = moment(date).get('year');
      const month = moment(date).get('month');
      if (month + 1 > 11) {
        return moment([year + 1, 0, 1]).valueOf() - 1
      }
      const monthEnd = moment([year, month + 1, 1]).valueOf() - 1;
      return monthEnd;
    };

    formatDataToArray = (object) => {
      const array = [];
      const values = Object.values(object);
      const names = Object.keys(values[0]).filter((item) => item !== 'date');
      for (let i = 0; i < values.length; i += 1) {
        const value = values[i];
        const weekDate = value.date;
        for (let j = 0; j < names.length; j += 1) {
          if (value[names[j]]) {
            array.push({
              date: weekDate,
              name: names[j],
              value: value[names[j]],
            });
          } else {
            array.push({
              date: weekDate,
              name: names[j],
              value: 0,
            });
          }
        }
      }
      return array;
    };

    formatData = () => {
      const {data} = this.props;

      const weekObj = {};
      const monthObj = {};
      for (let i = 0; i < data.length; i += 1) {
        const {date, name, value} = data[i];
        const month = this.getMonthOfYear(date);
        const week = this.getWeekOfYear(date);
        if (weekObj[week]) {
          if (weekObj[week][name]) {
            weekObj[week][name] += value;
          } else {
            weekObj[week][name] = value;
          }
        } else {
          weekObj[week] = {};
          weekObj[week][name] = value;
          const weekEnd = this.getWeekEnd(date);
          weekObj[week].date = `${date}~${moment(weekEnd).format('YYYY-MM-DD')}`;
        }

        if (monthObj[month]) {
          if (monthObj[month][name]) {
            monthObj[month][name] += value;
          } else {
            monthObj[month][name] = value;
          }
        } else {
          monthObj[month] = {};
          monthObj[month][name] = value;
          const monthEnd = this.getMonthEnd(date);
          monthObj[month].date = `${date}~${moment(monthEnd).format('YYYY-MM-DD')}`;
        }
      }

      const weeks = this.formatDataToArray(weekObj);
      const months = this.formatDataToArray(monthObj);
      return {
        day: this.props.data,
        week: weeks,
        month: months,
      };
    };

   handleChangeSelect = (value) =>  {
      this.setState({
        currentMode: value,
      });
    };

    renderSelect = () => {
      return (
        <Select defaultValue="day" style={{ width: 120 }} onChange={this.handleChangeSelect}>
          <Option value="day">天</Option>
          <Option value="week">周</Option>
          <Option value="month">月</Option>
        </Select>
      );
    };

    render() {
      const {total} = this.props;
        if (!this.props.data.length){
            return (
              <Empty />
            );
        }

        const currentYear = moment().get('year');
        const currentYearStart = moment([currentYear, 0, 1]).valueOf();
        const currentYearEnd = moment([currentYear + 1, 0, 1]).valueOf() - 1;
        const currentTime = moment().valueOf();

        const percent = Math.ceil((currentTime - currentYearStart) / (currentYearEnd - currentYearStart) * 100) / 100;
        const config = {
            data: this.state.data[this.state.currentMode],
            xField: 'date',
            yField: 'value',
            seriesField: 'name',
            xAxis: { tickCount: 10 },
            slider: {
                start: 0,
                end: percent,
              },
            legend: {
              position: 'top',
              itemName: {
                formatter: (text) => {
                  return `${text}:${total[text].toFixed(2)}`;
                }
              }
            },
            smooth: true,
            animation: {
              appear: {
                animation: 'path-in',
                duration: 5000,
              },
            },
          };
        return (
          <div>
              {this.renderSelect()}
              <Line {...config} />
          </div>
        );
    }
}
