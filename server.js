const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortURLs')
const app = express()

// Sử dụng async function để đảm bảo rằng kết nối MongoDB hoàn tất trước khi tiếp tục
async function startApp() {
  var check=false;
  var count=0;
  await mongoose.connect('mongodb://localhost/urlShortener', {
    
  })
  app.use(express.static('public'));
  app.set('view engine','ejs')
  app.use(express.urlencoded({extended: false}))

  app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find()
    count=shortUrls.length;
    res.render('index', {shortUrls: shortUrls, check:check})
  })

  app.post('/shortURLs', async (req,res) => {
    console.log(req);
   
    await ShortUrl.create({full:req.body.fullUrl})
    check=true;
    res.redirect('/')
  })
  app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if (shortUrl ==null) return res.sendStatus(404)
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
  })
  app.listen(process.env.PORT || 3001);
}

startApp();
