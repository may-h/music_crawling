const elastic = require('elasticsearch');
const client = new elastic.Client({
    host : 'localhost:9200',
    requestTimeout : 1000*3
});

var keyword = 'hello';

client.search({
    index : 'test',
    body : {
        "query" : {
            "match" : {
              "term" : keyword
            }
          }
    }
}).then((res) => console.log('성공', JSON.stringify(res))).catch((err) => console.log('실패'));