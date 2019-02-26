const express = require('express');
var config = require('./config/index');
const app = express(); // 请求server
const axios = require('axios');
var apiRouter = express.Router();
app.use('/api', apiRouter); // 通过路由请求数据

app.get('/api/getSomething', (req, res) => {

  let url = req.query.url;
  // let params = JSON.parse(req.query.data)// 要的是json数据
  let referer = req.query.referer;

  axios.get(url, {
    headers: {
      referer: referer,
    },
    // params: params
  }).then((response) => {
    let data = response.data;
    res.send(data)
  }).catch((e) => {
    console.log(e)
  })
});

app.use(express.static('./dist'));

var port = process.env.PORT || config.build.port;

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
  }
  console.log('listening at http://localhost:' + port + '\n');
});

// node prod.server.js启动服务器
