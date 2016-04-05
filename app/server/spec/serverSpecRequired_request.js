var http = require('http');


var collectData = function (response) {
  return new Promise(function (resolve, reject) {
    var data = '';
    response.on('data', function (chunk) {
      // console.log(chunk);
      data += chunk;
    });
    response.on('end', function () {
      resolve({statusCode: response.statusCode, data: String(data)});
    });
    response.on('error', function (error) {
      reject(error);
    });
  });
};



// requestOptions = {host:'localhost' , port: '8080', path: '/', method, data,headers:{'custom': 'Custom Header Demo works'}} pseudocode

var request = function (options) {
  if (typeof options !== 'object') { 
    throw new Error('options argument must be an object!');
  }
  return new Promise(function (resolve, reject) {
    var request = http.request(options, function (response) {
      // console.log(response);
      collectData(response)
        .then(resolve)
      .catch(reject);
    });
    if (options.data) {
      request.write(options.data);
    }
    request.end();
  });
};

module.exports = request;


// request({host:'localhost' , port: '8080', path: '/', method: 'GET'})
// .then(function (data) {
//   console.log('data: ', data);
// });


