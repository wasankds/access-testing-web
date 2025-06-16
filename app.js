

import express from 'express'
// import path from 'path'
import { fileURLToPath } from 'url'
import path  from 'path';
const app = express()
const port = process.env.PORT || 80
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

global.DEPLOY = 'dev' // production, dev, test
global.JS_USE = 'min' // obfus, min
global.DOMAIN = DEPLOY === 'dev' ? `http://localhost:${port}` : 'https://example.com'


import indexRouter from './routes/indexRouter.js'
// import accessRouter.js from './routes/accessRouter.js.js'

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
if(DEPLOY === 'dev') {
  app.use(express.static(path.join(__dirname, 'private')));
}else {
  app.use(express.static(path.join(__dirname, 'public')))
}
app.use(indexRouter)
// app.use(accessRouter.js)

app.get('*', (req, res) => { // แบบนี้ใช้กับ express 5 ไม่ได้
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})





// import MDBReader from 'mdb-reader';
// import fs from 'fs';

// const dbFilePath = "C:\\Users\\wasankds\\Documents\\wk.mdb";
// console.log('dbFilePath ===> : ', dbFilePath);

// fs.readFile(dbFilePath, (err, data) => {
//   if (err) {
//     console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:', err);
//     return;
//   }

//   try {
//     const reader = new MDBReader(data);
//     const tableNames = reader.getTableNames();
//     console.log('รายชื่อตาราง:', tableNames);

//     const tableNameToCheck = 'member';
//     if (tableNames.includes(tableNameToCheck)) {
//       const table = reader.getTable(tableNameToCheck);
//       const columns = table.getColumnNames();
//       const rows = table.getData();

//       console.log(`ข้อมูลในตาราง ===> : ${tableNameToCheck}`);
//       console.log('header ===> :', columns);
//       rows.forEach(row => {
//         console.log(row);
//       });
//     } else {
//       console.log(`ไม่พบตารางชื่อ ${tableNameToCheck}`);
//     }

//   } catch (error) {
//     console.error('เกิดข้อผิดพลาดในการประมวลผลฐานข้อมูล:', error);
//   }
// });