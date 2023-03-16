const cheerio = require('cheerio');
const axios = require('axios');
const { title } = require('process');

async function scrapeProducts() {
  try {
    const url = 'https://wltest.dns-systems.net/';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);	
    const products = [];
    
      const type = $('.row');   
               
        const rows = $(type).find('.col-xs-4');
        rows.each(function () {
            const optiontitle = $(this).find(".header").text().trim()
            const description = $(this).find('.package-description').text().trim()
            let price =  parseFloat($(this).find('.package-price').text().replace(/\D/g, ''));        
            const discount = $(this).find('.package-data').text();
            const type = discount.indexOf("Annual");
            let discountType = 0;
            if (type >= 0)
            {
                discountType = 1;
                price = parseFloat($(this).find('.package-price').text().split('\n')[0].replace(/\D/g, '')); 
               
            }

            products.push({  optiontitle, description, price, discount ,discountType });  
        });
      
      
      const cols = $('.col-cs-4');
      cols.each(function () {
          const optiontitle = $(this).find(".header").text().trim()
          const description = $(this).find('.package-description').text().trim()
          let price = parseFloat($(this).find('.package-price').text().replace(/\D/g, ''));     
          const discount = $(this).find('.package-data').text();          
          const type = discount.indexOf("Annual");
          let discountType = 0;
            if (type >= 0)
            {
                discountType = 1
                price = parseFloat($(this).find('.package-price').text().split('\n')[0].replace(/\D/g, ''));                
            }

          products.push({  optiontitle, description, price, discount ,discountType });  
      });
	
      products.sort((a, b) => {        
        if (a.price !== b.price) {
            return b.price - a.price;
          } else {
            return a.discountType.localeCompare(b.discountType);
          }
    });    

      return products;
      
  } catch (error) {
    console.error(error);
    return [];
  }
}

scrapeProducts()
  .then((products) => {
    
      console.log(products);
  })
  .catch((error) => {
    console.error(error);
  });
