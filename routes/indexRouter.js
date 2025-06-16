

import express from 'express'
import fs from 'fs'
import path from 'path'
const router = express.Router()

import odbc from 'odbc';

// import ejs from 'ejs'
// import { MongoClient, ObjectId } from 'mongodb'

//=====================================
router.get('/', async (req, res) => {
  console.log(`---------${req.originalUrl}---------`)
  console.log(req.query)
  const { mdbFile, accdbFile, abcAccDbFile  } = req.query

  const dir = path.join(process.cwd(), 'files')
  let files = [];
  try {
    files = await fs.promises.readdir(dir)
    const mdbFiles_get = files.filter(file => file.endsWith('.mdb'))
    const accdbFiles_get = files.filter(file => file.endsWith('.accdb'))
    const absAccDb_get = ["C:/Users/wasankds/Documents/Database1.accdb"]

    const optionRender = {
      title: 'Home',
      time: new Date().toISOString().slice(0, 10),
      fileName: 'index',
      mdbFiles_get:mdbFiles_get,
      accdbFiles_get:accdbFiles_get,
      absAccDb_get:absAccDb_get,
    }

    //=== อ่านไฟล์ MDB
    if(mdbFile){
      const accDataAll = await readMdb(mdbFile)
      const accData = accDataAll.filter(item => typeof item.ID !== 'undefined');
      optionRender.accData = accData
      optionRender.file = 'mdb'
      renderIndex(res, optionRender)
        .then(html => res.send(html))
        .catch(err => {
          console.error('Error rendering EJS:', err)
          res.status(500).send('Error rendering page.')
        })
    }
    //=== อ่านไฟล์ ACCDB
    else if(accdbFile){
      const rootDir = path.resolve();
      const dbFilePath = path.join(rootDir, 'files', accdbFile);      
      const accDataAll = await readAccdb(dbFilePath)
      const accData = accDataAll.filter(item => typeof item.EmployeeID !== 'undefined');
      optionRender.accData = accData
      optionRender.file = 'accdb'
      renderIndex(res, optionRender)
        .then( html => res.send(html))
        .catch(err => {
          console.error('Error rendering EJS:', err)
          res.status(500).send('Error rendering page.')
        })
    }
    //=== อ่านไฟล์ ABC_ACCDB แบบ Absolute path
    else if(abcAccDbFile){
      const accDataAll = await readAccdb(abcAccDbFile)
      const accData = accDataAll.filter(item => typeof item.EmployeeID !== 'undefined');
      optionRender.accData = accData
      optionRender.file = 'accdb'
      renderIndex(res, optionRender)
        .then(html => res.send(html))
        .catch(err => {
          console.error('Error rendering EJS:', err)
          res.status(500).send('Error rendering page.')
        })
    }
    //===  โหลดหน้าเปล่า 
    else{
      optionRender.accData = []
      optionRender.file = ''
      renderIndex(res, optionRender)
        .then( html => res.send(html))
        .catch(err => {
          console.error('Error rendering EJS:', err)
          res.status(500).send('Error rendering page.')
        })
    }
  } catch (err) {
    res.status(500).send('Error reading /private/js directory.')
  }
})

//===========================================
//
async function renderIndex(res, obj) {
  return new Promise((resolve, reject) => {
    res.render('index', obj, (err, html) => {
      if (err) {
        console.error('Error rendering EJS:', err)
        reject(err)
      } else {
        const cleanedHtml = removeHtmlComments(html)
        // console.log('cleanedHtml ===> ', cleanedHtml)
        resolve(cleanedHtml)
        // console.log('html ===> ', html)
        // resolve(html)
      }
    })
  })
}


//===========================================
//
async function readMdb(filename) {
  const rootDir = path.resolve();
  const dbFilePath = path.join(rootDir, 'files', filename);
  const msDriver = '{Microsoft Access Driver (*.mdb, *.accdb)}'
  const connStr = `Driver=${msDriver};DBQ=${dbFilePath};`;
  let conn = await odbc.connect(connStr);
  try {
    return  await conn.query('SELECT * FROM member');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านฐานข้อมูล:', error);
    return error;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

//===========================================
//
async function readAccdb(dbFilePath) {
  const msDriver = '{Microsoft Access Driver (*.mdb, *.accdb)}'
  const connStr = `Driver=${msDriver};DBQ=${dbFilePath};`;
  let conn = await odbc.connect(connStr);
  try {
    // console.log('result ===> ', result);
    return await conn.query('SELECT * FROM qryrptEmployeeEmailList');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอ่านฐานข้อมูล:', error);
    return error;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}
// //===========================================
// //
// async function readAccdb(filename) {
//   const rootDir = path.resolve();
//   const dbFilePath = path.join(rootDir, 'files', filename);
//   const msDriver = '{Microsoft Access Driver (*.mdb, *.accdb)}'
//   const connStr = `Driver=${msDriver};DBQ=${dbFilePath};`;
//   let conn = await odbc.connect(connStr);
//   try {
//     // console.log('result ===> ', result);
//     return await conn.query('SELECT * FROM qryrptEmployeeEmailList');
//   } catch (error) {
//     console.error('เกิดข้อผิดพลาดในการอ่านฐานข้อมูล:', error);
//     return error;
//   } finally {
//     if (conn) {
//       await conn.close();
//     }
//   }
// }



// //===========================================
// // ระหว่างเรื่อง  ./private และ ./publicห
// //
// router.get('/product', (req, res) => {
//   const option = {
//     title: 'Product',
//     fileName: 'product',
//     time: new Date().toISOString().slice(0, 10),
//   }
//   res.render('product', option, async (err, html) => { // obj {} สำหรับส่งตัวแปรไปให้ EJS
//     if (err) {
//       console.error('Error rendering EJS:', err)
//       return res.status(500).send('Error rendering page.')
//     }
//     const cleanedHtml = removeHtmlComments(html)
//     res.send(cleanedHtml)
//   })
// })


 

export default router


//==========================================================
// ฟังก์ชันสำหรับลบ
// - คอมเมนต์ HTML (ใช้ Regular Expression)
// - ลบบรรทัดว่าง (ใช้ Regular Expression)
// โดยใช้ Regular Expression
function removeHtmlComments(htmlString) {
  return htmlString.replace(/<!--[\s\S]*?-->/g, '')
                   .replace(/^\s*[\r\n]/gm, '')
                   
}
