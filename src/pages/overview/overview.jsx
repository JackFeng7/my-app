import React, {PureComponent} from 'react';
import {Empty, Tabs} from 'antd';

import Line from '../../components/charts/line';
import Pie from '../../components/charts/pie';
import Input from './input';

const { TabPane } = Tabs;

export default class Overview extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lineData: [],
            totalData: {},
        };

        this.tabs = [
            {
                key: 'line',
                name: '趋势图',
                component: (lineData, totalData) => (<Line data={lineData} total={totalData}/>),
            },
            {
                key: 'statistic',
                name: '统计图',
            component: (lineData, totalData) => (<Pie pieData={totalData}/>),
            },
        ];
    }

    changeTab = (key) => {
        console.log(key);
    };
  
    setData = (data, total) => {
        this.setState({
            lineData: data,
            totalData: total,
        });
    };

    renderInput = () => {
        return (
            <Input setData={this.setData}/>
        );
    };

    render() {
        const {lineData, totalData} = this.state;
        if (!lineData.length || !Object.keys(totalData).length) {
            return (
                <div style={{display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 6}}>
                    {this.renderInput()}
                    <Empty />
                </div>
              );
        }
        return (
            <div style={{display: 'flex', flex: 1, padding: '0px 16px', backgroundColor: '#fff'}}>
                <Tabs defaultActiveKey="line" onChange={this.changeTab} style={{flex: 1}}>
                {
                    this.tabs.map((tab) => {
                        return (
                            <TabPane tab={tab.name} key={tab.key}>
                                {tab.component(lineData, totalData)}
                            </TabPane>
                        );
                    })
                }
                </Tabs>
          </div>
        );
    }
}
