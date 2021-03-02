import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Button} from 'antd';
import { useIntl } from 'umi';
import XLSX from 'xlsx';

import Line from '../components/charts/line';

export default () => {

  const [fileJson, setFileJson] = React.useState([]);
  const intl = useIntl();
  const fileInput = React.createRef();

  // 格式为json
  const getFileJson = (workbook) => {
    const json = [];
    const sheets = workbook.Sheets;
    Object.keys(sheets).forEach((key) => {
      json.push({
        name: key,
        data: XLSX.utils.sheet_to_json(sheets[key]),
      });
    });
    setFileJson(json);
  }

  // 聚焦上传文件
  const click = () => {
    fileInput.current.click();
  }

  // 上传文件
  const uploadImportFile = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {type: 'binary'});
      getFileJson(workbook);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <PageContainer>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: '欢迎使用，已经发布。',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <div>
          <input
            ref={fileInput}
            style={{display: 'none'}}
            type='file'
            accept='.xlsx, .xls'
            onChange={uploadImportFile}
          />
          <Button
            onClick={click}
          >
            {'导入'}
          </Button>
          <div style={{flex: 1, margin: '10px 30px'}}>
              <Line data={fileJson}/>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
