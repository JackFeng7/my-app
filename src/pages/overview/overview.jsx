import React, {PureComponent} from 'react';
import {Empty, Tabs} from 'antd';

import Line from '../../components/charts/line';
import Pie from '../../components/charts/pie';

const { TabPane } = Tabs;

export default class Overview extends PureComponent {
    constructor(props) {
        super(props);
        this.state={};
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

    render() {
        const {lineData, totalData} = this.props;
        if (!lineData.length || !Object.keys(totalData).length) {
            return (
                <Empty />
              );
        }
        return (
            <div style={{margin: '10px 30px'}}>
                <Tabs defaultActiveKey="line" onChange={this.changeTab}>
                {
                    this.tabs.map((tab) => {
                        return (
                            <TabPane tab={tab.name} key={tab.key} style={{minHeight: 500}}>
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
