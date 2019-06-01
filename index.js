const fs = require('fs');
const path = require('path');
const Json2csvTransform = require('json2csv').Transform;
const columns = require('./columns.js');

// vars to be defined
const inputCsv; // loc of file to be read, input folder
const jsonMiddleware; // loc of json holder file, json folder
const outputCsv; // loc of csv output, output folder

fs.readFile(inputCsv, 'utf8', (err, data) => {
  var array = data.split(`\n`);
  console.log(array[0]);

  // manipulation to store values into a json object as opposed to the history csv
  var ridiculousArray = array.map((e) => {
    return e.substring(1, (e.length - 1)).split(`","`);
  })
  var morphableArray = ridiculousArray.map((e) => {
    var output = {};
    for (var i = 0; i < e.length; i++) {
      if (i === 0) {
        output['id'] = e[i];
      } else if (i === 1) {
        output['name'] = e[i];
      } else if (i % 2 === 0) {
        output[e[i]] = e[i + 1];
      }
    }
    return output;
  });

  const fields = columns.dealStages; // variable - the headers are manually set in columns.js - this needs to be set currently and exported for use here

  // settings for json2csv, don't need to change
  const opts = { fields };
  const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };

  // convert to json file for storage
  fs.writeFile(jsonMiddleware, JSON.stringify(morphableArray), function(err) {
    if (err) {
      console.log(err);
      return;
    }

    const input = fs.createReadStream(jsonMiddleware, { encoding: 'utf8' });
    const output = fs.createWriteStream(outputCsv, { encoding: 'utf8' });
    const json2csv = new Json2csvTransform(opts, transformOpts);
    
    const processor = input.pipe(json2csv).pipe(output);

    json2csv
    .on('header', header => console.log(header))
    .on('line', line => console.log(line))
    .on('error', err => console.log(err));
  })
});