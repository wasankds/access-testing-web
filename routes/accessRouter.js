

import odbc from 'odbc';

// //=== กรณีไฟล์ไม่อยู่ในโฟลเดอร์โปรเจกต์ - Absolute path
// const dbFilePath = "C:/Users/wasankds/Documents/Database1.accdb";

//=== กรณีไฟล์อยู่ในโฟลเดอร์โปรเจกต์ - Relative path
const rootDir = path.resolve();
const dbFilePath = path.join(rootDir, 'files', 'WK_ACCDB.accdb');

//=== 
const msDriver = '{Microsoft Access Driver (*.mdb, *.accdb)}'
const connectionString = `Driver=${msDriver};DBQ=${dbFilePath};`;


async function readAccdb() {
  let connection = await odbc.connect(connectionString);
  try {
    // const result = await connection.query('SELECT * FROM Customers');
    // console.log('result ===> ' , result);


    // const result = await connection.query('SELECT * FROM qryCustomerList');
    const result = await connection.query('SELECT * FROM qryrptEmployeeEmailList');
    console.log('result ===> ', result);


  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านฐานข้อมูล:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

readAccdb();
