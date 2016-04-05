var http = require('http');


var collectData = function (response) {
  return new Promise(function (resolve, reject) {
<<<<<<< f12b5d03e20e958e969918475482b93982d0b469
    var data = '';
=======
    data = '';
>>>>>>> chai as promised async tests begun
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

<<<<<<< f12b5d03e20e958e969918475482b93982d0b469
var request = function (options) {
=======
module.exports = request = function (options) {
>>>>>>> chai as promised async tests begun
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

<<<<<<< f12b5d03e20e958e969918475482b93982d0b469
module.exports = request;
=======
>>>>>>> chai as promised async tests begun


// request({host:'localhost' , port: '8080', path: '/', method: 'GET'})
// .then(function (data) {
//   console.log('data: ', data);
// });


