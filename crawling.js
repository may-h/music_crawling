var cheerio = require('cheerio');
var request = require('request');
var mysql = require('mysql'); 
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'hmsk6534',
    port : 3306,
    database : 'music_DB',
    insecureAuth : true
});
 
// var url = 'http://www.melon.com/chart/';
var url = 'https://www.melon.com/chart/age/index.htm?chartType=YE&chartGenre=KPOP&chartDate=2006';
var title_items = [],
    artist_items = [],
    up_date,
    up_time;
 
 
request(url, function(error, response, html){
  if (!error) {
    var $ = cheerio.load(html);
    var count = $('.ellipsis.rank01 > span > a').length; 

   // 곡명 파싱
      $('.ellipsis.rank01 > span > a').each(function(){
        var title = $(this).text().replace(/\(/g, '').replace(/\)/g, '');
        title_items.push(title);
      })

    // 아티스트명 파싱
      $('.ellipsis.rank02 > span').each(function(inx, ele){
        var artist = $(this).text().replace(/\(/g, '').replace(/\)/g, '').replace(/\,/g, ' &');
        artist_items.push(artist);
      })
 
    // // 업데이트 날짜
    // $('.year').each(function(){
    //   up_date = $(this).text();
    // })
 
    // // 업데이트 시간
    // $('.hhmm > span').each(function(){
    //   up_time = $(this).text();
    // })
 
    // //xxxx년 xx월 xx일 오후/오전 xx시 format
    // var up_date_arr = up_date.split('.');
    // var up_time_arr = up_time.split(':');
    // var newtime;
 
    // // 오후 오전 삽입
    // if (up_time_arr[0] >12) {
    //   up_time_arr[0] = up_time_arr[0] - 12
    //   newtime = "오후 "+up_time_arr[0];
    // } else {
    //   newtime = "오전 " +up_time_arr[0];
    // }
 
    // 콘솔창 출력
    console.log("< 멜론 차트 1 ~ "+count+"위 >");


    connection.connect();

    // 순위 제목 - 아티스트명
    for (var i = 1; i < count+1; i++) {

      console.log(i+ "위" + " " + title_items[i-1] + " - " + artist_items[i-1]);
    //   connection.query(`insert into music_table values ( ${i}, '${title_items[i-1]}', '${artist_items[i-1]}', '${up_date_arr[0]}', '${up_date_arr[0]}-${up_date_arr[1]}-${up_date_arr[2]} ${up_time_arr[0]}', ${i});`, 
    //   function(err, result) {
    //       if(err) {console.log('error!!!  ', err)} else {
    //           console.log(result);
    //       };
    //  })
    }

    connection.end();
    // 업데이트 시간
    // console.log("("+up_date_arr[0]+"년 "+up_date_arr[1]+"월 "+up_date_arr[2]+"일 "+newtime+"시에 업데이트됨)");
  }
});
