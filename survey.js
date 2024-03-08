const mysql = require('mysql2');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'0000',
  database:'survey',
  port:'3306'
});

const app = express();
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.listen(3000, () => {
  console.log('서버실행중');
  connection.connect();
});

app.get('/', (_, response) => {
  fs.readFile('survey.html', 'utf-8', (error,data) => {
    if(error) throw error;
    response.send(data);
  });
});

app.post('/submit', (request, response) => {
  const body = request.body;

  // 함수를 사용하여 값이 undefined이면 0을 반환하도록 함
  const ValOrDef = (key, defV = 0) => (body[key] !== undefined ? body[key] : defV);

  // 첫 번째 섹션
  const ch1 = Array.from({ length: 9 }, (_, i) => ValOrDef(`ch1-${i + 1}`));

  // 두 번째 섹션
  const ra2 = Array.from({ length: 10 }, (_, i) => ValOrDef(`ra2-${i + 1}`));

  // 세 번째 섹션
  const ra3 = Array.from({ length: 7 }, (_, i) => ValOrDef(`ra3-${i + 1}`));

  // 각 섹션에 대한 결과
  console.log('Section 1:', ch1);
  console.log('Section 2:', ra2);
  console.log('Section 3:', ra3);

  // connection.query(
  //   'INSERT INTO survey (1_1, 1_2, 1_3, 1_4, 1_5, 1_6, 1_7, 1_8, 1_9, 2_1, 2_2, 2_3, 2_4, 2_5, 2_6, 2_7, 2_8, 2_9, 2_10, 3_1, 3_2, 3_3, 3_4, 3_5, 3_6, 3_7) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
  //   [
  //     ch1[0], ch1[1], ch1[2], ch1[3], ch1[4], ch1[5], ch1[6], ch1[7], ch1[8],
  //     ra2[0], ra2[1], ra2[2], ra2[3], ra2[4], ra2[5], ra2[6], ra2[7], ra2[8], ra2[9],
  //     ra3[0], ra3[1], ra3[2], ra3[3], ra3[4], ra3[5], ra3[6]
  //   ],
  
  // INSERT INTO 쿼리 줄이기
  const columns = [...Array(9).keys()].map(i => `1_${i + 1}`).concat([...Array(10).keys()].map(i => `2_${i + 1}`)).concat([...Array(7).keys()].map(i => `3_${i + 1}`));
  const values = [...ch1, ...ra2, ...ra3];
  
  connection.query(
    `INSERT INTO survey (${columns.join(', ')}) VALUES (${values.map(_ => '?').join(', ')})`,
    values,
    (error, _) => {
      if (error) throw error;
      response.redirect('/');
  });
});
