import React from 'react';
import { Button} from 'antd';
import XLSX from 'xlsx';
import moment from "moment";

export default (props) => {

  const [fileName, setFileName] = React.useState('未选择文件');
  const fileInput = React.createRef();

  const formatData = (json) => {
    const data = [];
    const total = {};
    json.forEach((sheet) => {
      sheet.data.forEach((row) => {
        const columnNames = Object.keys(row);
        for (let index = 1; index < columnNames.length; index += 1) {
          const element = row[columnNames[index]];
          if (total[columnNames[index]]) {
            total[columnNames[index]] += element;
          } else {
            total[columnNames[index]] = element;
          }
          data.push({
            date: moment(row[columnNames[0]]).add(43, 'seconds').format('YYYY-MM-DD'), // js-xlsx库解析时间会少43秒
            name: columnNames[index],
            value: element,
          });
        }
      });
    });
    props.setData(data, total);
  }

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
    formatData(json);
  }

  // 聚焦上传文件
  const click = () => {
    fileInput.current.click();
  }

  // 上传文件
  const uploadImportFile = (event) => {
    if (!event.target.files.length) {
      return;
    }
      const file = event.target.files[0];
      setFileName(file.name)
      const reader = new FileReader();
      reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {type: 'binary', cellDates: true});
      getFileJson(workbook);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{height: 50}}>
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
        <span style={{marginLeft: 10, color: 'skyblue'}}>{fileName}</span>
    </div>
  );
};
