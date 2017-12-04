// pages -> home

const {
  readFile,
} = require('../utils');

const start = (req, res) => {
  let tmp = readFile(`./src/configs/site.conf.json`);
  let data = JSON.parse(tmp);

  let {meta} = data;
  let {
    image = '',
    url = '',
  } = meta;
  if (!image.startsWith('http')) {
    data.meta.image = `${url}${image}`;
  }

  return res.render('index', data);
};

module.exports = {
  start,
};
