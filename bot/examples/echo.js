// var fs = require('fs');

// var fs = require('fs');
//     fs.appendFile('123.txt', 'Hello content!', function (err) {
//     if (err) throw err;
//     console.logs('Saved!');
// });


const request = require('request')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;



function getPrice()
{
    return new Promise(function(resolve, reject)
    {
       let body = request('https://hard.rozetka.com.ua/monitors/c80089/', (err, res, body) => 
       {
           let dom = new JSDOM(`${body}`, ); 
           let list = []; 
           console.log('-----------------------------------------'); 
           let priceList = dom.window.document.querySelectorAll(".catalog-grid__cell"); 
            
           for(let i of priceList)
           {
               const title = i.querySelector(".goods-tile__title").textContent;  
               const price = i.querySelector(".goods-tile__price-value").textContent; 
                
               list.push(`${title} - ${price} \r\n\n`); 
               //console.logs(`${title} - ${price}`);
           }
           
           console.log('-----------------------------------------'); 
           resolve(list); 
           // var fs = require('fs'); 
           //     fs.appendFile('123.html', body.toString("utf-8"), function (err) {
           //     if (err) throw err; 
           //     console.logs('Saved!');
           // });
   
       });
    }).then((data) => 
    {
       return data; 
    })
    .catch((error)=> { return error }); 
   
}

 module.exports = getPrice; 
//console.dir(body.get); 




  