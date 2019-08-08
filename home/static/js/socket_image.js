function getParagraph(block) {
    //this function gonna return a bunch of words in a block
    var res = [];
    var paras = block['paragraphs'];
    for (i in paras) {
        var para = paras[i];
        res = res.concat(getWord(para));
    }
    return res;
}

function getWord(para) {
    var res = [];
    var words = para['words'];
    for (i in words) {
        var word = words[i];
        var coordinate = word['boundingBox'];
        res.push({ 'text': getSym(word), 'boundingBox': coordinate });
    }
    // console.log(res);
    return res;
}

function getSym(word) {
    var res = '';
    var symbols = word['symbols'];
    for (i in symbols) {
        res += symbols[i]['text'];
    }
    return res;
}
// Sửa hàm này !
function merge_text(w) {
    console.log(w);
    var res = [];
    var words = w['words'];
    var index = 0;

    words.sort(function(a, b) {
        var y1 = b['boundingBox']['vertices'][3]['y'];
        var y2 = a['boundingBox']['vertices'][3]['y'];
        var x1 = b['boundingBox']['vertices'][3]['x'];
        var x2 = a['boundingBox']['vertices'][3]['x'];
        if (y1 - y2 > 15) return 1;
        else if (y1 - y2 <= 15 && x2 > x1) return 1;
        else return 0;
    });
    var count = 0;
    while (index <= words.length - 1) {
        res.push([]);
        var temp = words[index]['text'];
        res[count].push(temp);
        if (index < words.length - 2) {
            while (Math.abs(words[index]['boundingBox']['vertices'][3]['y'] - words[index + 1]['boundingBox']['vertices'][3]['y']) < 20) {
                temp = words[index + 1]['text'];
                res[count].push(temp);
                index += 1;
                if (index >= words.length - 1) {
                    break;
                }
            }
        }
        index += 1;
        count++;
    }
    var ans = [];
    var i = 0;
    console.log(res);
    for (i = 0; i < count; i++) {
        ans.push([]);
        for (k in res[i].length) {
            if (res[i][k][0] >= '0' && res[i][k][0] <= '9') {
                if (k + 1 < res[i].length) {
                    if (res[i][k + 1][0] == '.') {
                        if (k + 2 < res[i].length && res[i][k + 2][0] >= '0' && res[i][k + 2][0] <= '9') {
                            var tmp = "";
                            tmp += res[i][k] + "";
                            tmp += res[i][k + 1] + "";
                            tmp += res[i][k + 2] + "";
                            ans[i].push(tmp);
                            k += 2;
                        } else {
                            ans[i].push(res[i][k]);
                        }
                    } else {
                        ans[i].push(res[i][k]);
                    }
                }
            } else {
                var tmp = "";
                while (1) {
                    if (k >= res[i].length) {
                        break;
                    }
                    if (res[i][k][0] >= '0' && res[i][k][0] <= '9') {
                        break;
                    }
                    tmp += res[i][k] + " ";
                    k++;
                }
                ans[i].push(tmp);
            }
        }
    }
    return ans;
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
        reader.onload = (function(theFile) {
            return function(e) {
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

    socket.onmessage = function(e) {
        console.log(e);
        var responseData = JSON.parse(e.data);
        $('#images').append($('<li><img alt=\"Avatar\"src=\"data:image/png;base64,' + responseData.base64 + '\"></li>'));
        var text_data = JSON.parse(responseData.Text_Description);
        var blocks = text_data['pages'][0]['blocks'];

        var words = { 'words': [] };
        for (index in blocks) {
            var block = blocks[index];
            words['words'] = words['words'].concat(getParagraph(block)); //bind word from each block together
        }

        var res = merge_text(words);
        console.log(res);

        // for (i in res.length) {

        //     // word = words['words'][index];
        //     // $('#result').append($('<li> ' + JSON.stringify(word['boundingBox']['vertices']) + word['text'] + ' </li>'))
        //     $('#result').append($('<li> ' + res[5][i] + ' </li>'))

        // }
    };


};
run();
