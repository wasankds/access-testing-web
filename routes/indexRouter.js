

import express from 'express'
import fs from 'fs'
import path from 'path'
const router = express.Router()
// import ejs from 'ejs'
// import { MongoClient, ObjectId } from 'mongodb'

//=====================================
router.get('/', (req, res) => {
  console.log(`---------${req.originalUrl}---------`)
  console.log(req.body)

  const dir = path.join(process.cwd(), 'files');
  let files = [];
  try {
    const files = fs.readdirSync(dir)
    const mdbFiles = files.filter(file => file.endsWith('.mdb'));
    const accdbFiles = files.filter(file => file.endsWith('.accdb'));
    console.log('MDB files:', mdbFiles);

    // console.log('JS files in /private/js:', jsFiles);
    // console.log('CSS files in /private/css:', cssFiles);

    const option = {
      title: 'Home',
      time: new Date().toISOString().slice(0, 10),
      fileName: 'index',
      mdbFiles:mdbFiles,
      accdbFiles:accdbFiles,
    }
    // console.log('option:', option)
    res.render('index', option, async (err, html) => { // obj {} สำหรับส่งตัวแปรไปให้ EJS
      // console.log('html:', html)
      if (err) {
        console.error('Error rendering EJS:', err)
        return res.status(500).send('Error rendering page.')
      }
      const cleanedHtml = removeHtmlComments(html)
      res.send(cleanedHtml)
    })
  } catch (err) {
    res.status(500).send('Error reading /private/js directory.')
  }
})


//===========================================
// ระหว่างเรื่อง  ./private และ ./publicห
//
router.get('/product', (req, res) => {
  const option = {
    title: 'Product',
    fileName: 'product',
    time: new Date().toISOString().slice(0, 10),
  }
  res.render('product', option, async (err, html) => { // obj {} สำหรับส่งตัวแปรไปให้ EJS
    if (err) {
      console.error('Error rendering EJS:', err)
      return res.status(500).send('Error rendering page.')
    }
    const cleanedHtml = removeHtmlComments(html)
    res.send(cleanedHtml)
  })
})


 

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
