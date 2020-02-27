var cheerio = require('cheerio');
var request = require('request-promise');
const url = 'https://www.melon.com/chart/age/index.htm?chartType=YE&chartGenre=KPOP&chartDate=';
var mysql = require('mysql');
var mysql_conf = require('./mysql_database.js');
var connection = mysql.createConnection(mysql_conf);

console.log(mysql_conf);

// for(i = 2000; i<=2019; i++) {

    const urlByYear = 'https://www.melon.com/chart/style/index.htm#params%5Bidx%5D=1&params%5BstartDay%5D=20200217&params%5BendDay%5D=20200223&params%5BisFirstDate%5D=false&params%5BisLastDate%5D=true'; 
    
    
    request(urlByYear).then(function(html)  {
        // console.log(html);
            $ = cheerio.load(html);
            var count = $('.ellipsis.rank01 > span > a').length; 
            var title_items = [];
            var artist_items = [],
            up_date,
            up_time;
            console.log(urlByYear);
            console.log(count)
  
     // 곡명 파싱
        $('.wrap_song_info > .ellipsis.rank01 > span').each(function(){
          var title = $(this).text().replace(/\(/g, '').replace(/\)/g, '').trim();
          title_items.push(title);
        })
  
      // 아티스트명 파싱
        $('.ellipsis.rank02 > span').each(function(inx, ele){
          var artist = $(this).text().replace(/\(/g, '').replace(/\)/g, '').replace(/\,/g, ' &').trim();
          artist_items.push(artist);
        })
   
      // 콘솔창 출력
      console.log("< 멜론 차트 1 ~ "+count+"위 >");
      connection.connect();
  
      // 순위 제목 - 아티스트명
      for (var i = 1; i < count+1; i++) {
  
        console.log(i+ "위" + " " + title_items[i-1] + " - " + artist_items[i-1]);
        connection.query(`insert into music_table values ( ${i}+100, '${title_items[i-1]}', '${artist_items[i-1]}', 2019, '2019-10-14', ${i});`, 
        function(err, result) {
            if(err) {console.log('error!!!  ', err)}
       })
      }
  
      connection.end();
      // 업데이트 시간
    //   console.log("("+up_date_arr[0]+"년 "+up_date_arr[1]+"월 "+up_date_arr[2]+"일 "+newtime+"시에 업데이트됨)");
    
    
    })
// })


