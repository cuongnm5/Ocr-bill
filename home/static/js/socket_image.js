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
      // $('#images').append($('<li><img alt=\"Avatar\"src=\"data:image/png;base64,' + responseData.base64 + '\"></li>'));
      $('#result').append($('<li> ' + responseData.Text_Description + ' </li>'));
    }


  };
  run(); 