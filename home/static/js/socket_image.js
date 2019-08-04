function getParagraph(block){
  //this function gonna return a bunch of words in a block
  var res = [];
  var paras = block['paragraphs'];
  for (i in paras){
    var para = paras[i];
    res = res.concat(getWord(para));
  }
  return res;
}
 
function getWord(para){
  var res = [];
  var words = para['words'];
  for (i in words){
    var word = words[i];
    var coordinate = word['boundingBox'];
    res.push({'text': getSym(word), 'boundingBox': coordinate});
  }
  // console.log(res);
  return res;
}
 
function getSym(word){
  var res = '';
  var symbols = word['symbols'];
  for (i in symbols){
    res += symbols[i]['text'];
  }
  return res;
}

function merger_text(w) {
  var res = [];
  var words = w['words'];
  var index = 0;
  
  words.sort(function(a, b) {
    return a['boundingBox']['vertices'][1]['y'] - b['boundingBox']['vertices'][1]['y'];
  });

  while (index <= words.length - 1){
    var temp = '';
    temp += words[index]['text'] + ' ';
    if(index < words.length - 2) {
      while (Math.abs(words[index]['boundingBox']['vertices'][1]['y'] - words[index+1]['boundingBox']['vertices'][1]['y']) < 15) 
      {
        temp += words[index+1]['text'] + ' ';
        index+=1;
        if(index >= words.length - 1) {
          break;
        }
      }     
    }
    index+=1;
    res.push(temp);
  }
  return res;
}
 
 
function run() {
    endpoint = 'ws://' + window.location.host + '/message/';
    console.log(window.location.host)
    var socket = new ReconnectingWebSocket(endpoint);
 
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      document.getElementById('files').addEventListener('change', handleFileSelect, false);
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
 
    function handleFileSelect(evt) {
      var f = evt.target.files[0]; 
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
          var binaryData = e.target.result;
          //Converting Binary Data to base 64
          var base64String = window.btoa(binaryData);
          //showing file converted to base64
          // document.getElementById('base64').value = base64String;
          socket.send(JSON.stringify({ "imgstring": base64String }));
          alert('File converted to base64 successfuly!\nCheck in Textarea');
        };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsBinaryString(f);
    };
 
    socket.onmessage = function (e) {
      console.log(e);
      var responseData = JSON.parse(e.data);
      $('#images').append($('<li><img alt=\"Avatar\"src=\"data:image/png;base64,' + responseData.base64 + '\"></li>'));
      
      // var text_data = JSON.parse(responseData.Text_Description);
      // var blocks = text_data['pages'][0]['blocks'];
      // console.log(blocks);
      // var words = {'words': []};
      // for (index in blocks){
      //   var block = blocks[index];
      //   words['words'] = words['words'].concat(getParagraph(block)); //bind word from each block together
      // }
 
      // console.log(words);
      // var res=merger_text(words);
      // console.log(res);
 
      // for (i in res){
      //   // word = words['words'][index];
      //   // $('#result').append($('<li> ' + JSON.stringify(word['boundingBox']['vertices']) + word['text'] + ' </li>'))
      //   $('#result').append($('<li> ' + res[i] + ' </li>'))
      
      // }
    };
 
 
  };
  run(); 