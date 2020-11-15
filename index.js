
// DEFAULT state
let vis = 'LE';
let country_outer_svg = null;

Promise.all([d3.json('countries.json'), d3.csv('Life Expectancy Data.csv')])
    .then(([jsonData, csvData]) => {

        //SET UP
        setDoubleScroll();

        //Combining jsonData and csvData
        let data = getCountryImageInfo(jsonData, csvData);

        //Data setup
        setUp(data);

        updateDataState(data);

        setButtons(data);

    });

/**
 * Set up visualization container and the country names and lines within an svg tag.
 * @param data - combination of jsonData and csvData
 */
function setUp(data){
         //SETUP of document
         let country_div = d3.select('#vis_container').selectAll('div').append('div')
             .data(data)
             .enter()
             .append('div')
             .style('height', '3rem')

         country_outer_svg = country_div
             .append('svg')
             .attr('xmlns', 'http://www.w3.org/2000/svg')
             .attr('width', '300rem')

         let country_outer_svg_text = country_outer_svg
             .append('text')
             .attr('class', 'country_names')
             .attr('y', '10')
             .attr('dy', '0.35em')
             .text(function(d){
                 return d['name'];
             })

            let country_names = document.querySelectorAll('#vis_container div');
            country_names.forEach(function(d){                                                                                     
                                                                                                                                   
                                                                                                                                   
                let svg = d.querySelector('svg');                                                                                  
                let text = svg.querySelector('text');                                                                              
                let bbox = text.getBBox();                                                                                         
                                                                                                                                   
                let width = bbox.width;                                                                                            
                let height = bbox.height;                                                                                          
                                                                                                                                   
                for (let i = 0 ; i< data.length; i++){                                                                             
                    if (text.textContent === data[i]['name'] ) {                                                                   
                        data[i]['width'] = width;                                                                                  
                        data[i]['height'] = height;                                                                                
                                                                                                                                   
                    }                                                                                                              
                }                                                                                                                  
                                                                                                                                   
                let line = document.createElementNS('http://www.w3.org/2000/svg','line');                                          
                line.setAttribute('stroke', 'black');                                                                              
                line.setAttribute('x1', width+20);
                line.setAttribute('x2', '100%');                                                                                   
                line.setAttribute('y1', height/2 + 5);                                                                             
                line.setAttribute('y2', height/2 + 5);                                                                             
                svg.appendChild(line);                                                                                             
            });                                                                                                                    
                                                                                                                                   
                displayData(data);

}

/**
 * Combines necessary data
 * @param jsonData - country names and official abbreviations
 * @param csvData - Life Expectancy data (i.e which countries to get the flags for)
 * @returns {[]} data - an array of Objects, combining information from jsonData and csvData
 */
function getCountryImageInfo(jsonData, csvData){
    let data = [];
    csvData.forEach(function(d){
        let name = d['Country'].trim();
        for (let key in jsonData){
            if (jsonData[key].trim() === name){
                let abbrev = key;
                let temp = {'name': name, 'code': abbrev, 'life_expectancy': d['Life expectancy '], 'bmi': d[' BMI '],
                'gdp': d['GDP'], 'income_resources': d['Income composition of resources'], 'schooling': d['Schooling'], 'location' : `https://github.com/Elzanne1/583-Var1/tree/master/svg/${abbrev}.svg`};
                data.push(temp);
            }
        }
    });
    return data;
}

/**
 * Sorts the data based on values in the different columns
 * @param data - array to sort
 * @param comparisonAttr - which column is the sorting key
 * @returns {this}
 */
function sortingVals(data, comparisonAttr){
      sorted = [...data].sort(function(a,b) {
          if (Number(a[comparisonAttr]) > Number(b[comparisonAttr])) {
              return -1;
          } else if (Number(a[comparisonAttr]) < Number(b[comparisonAttr])) {
              return 1;
          } else {
              return 0;
          }
      });

      return sorted;
}

/**
 * Returns the index of a country from one of the sorted arrays
 * @param array - array of objects
 * @param value - the country name to find
 * @returns {number}
 */
function getIndex( array, value){
    for (let i = 0; i< array.length ; i++){
        if (array[i]['name'] === value){
            return i;
        }

    }
    return -1;  
}

/**
 * Sets up functionality of buttons used to switch the data being displayed
 * @param data - combination of csvData and jsonData
 */
function setButtons(data){
    let btnLE = document.getElementById('LE');
    btnLE.onclick = function(){
        vis = 'LE';
        updateDataState(data);
    }

    let btnBMI = document.getElementById('BMI');
    btnBMI.onclick = function(){
        vis = 'BMI';
        updateDataState(data);
    }

    let btnGDP = document.getElementById('GDP');
    btnGDP.onclick = function(){
        vis = 'GDP';
        updateDataState(data);
    }

    let btnIC = document.getElementById('IC');
    btnIC.onclick = function(){
        vis = 'IC';
        updateDataState(data);
    }
    
    let btnS = document.getElementById('S');
    btnS.onclick = function(){
        vis = 'S';
        updateDataState(data);
    }
}

/**
 * Sets up the double horizontal scroll feature at the top and bottom of the visualization
 */
function setDoubleScroll(){
    let upper_wrapper = document.getElementById('wrapper_upper');
    let lower_wrapper = document.getElementById('wrapper_lower');

    upper_wrapper.onscroll = function() {
        lower_wrapper.scrollLeft = upper_wrapper.scrollLeft;
    }

    lower_wrapper.onscroll = function(){
        upper_wrapper.scrollLeft = lower_wrapper.scrollLeft;


    }
}

/**
 * Convert the smaller encoding string into a string used for a header on the html page
 * @param vis - which data to show
 * @returns {string}
 */
function translateCoding(vis){
    if (vis === 'LE'){
        return 'Life Expectancy'
    }

    else if (vis === 'GDP'){
        return 'GDP'
    }

    else if (vis === 'BMI'){
       return 'BMI'
    }

    else if (vis === 'IC'){
        return 'Income composition of resources'
    }

    else if (vis === 'S'){
        return 'Average number of years of schooling'
    }
}

/**
 * Changes the data being displayed
 * @param data - combined csvData and jsonData
 */
function updateDataState(data){
   //STATE WHICH DATA IS CURRENTLY BEING DISPLAYED
   let info = document.getElementById('info');
   info.innerText = `Currently Showing: ${translateCoding(vis)}`;
   if (country_outer_svg !== null){
       displayData(data, country_outer_svg);
   }

}

/**
 * Changes position of country flags based on their position in the sorted array of data
 * @param data - combined csvData and jsonData
 */
function displayData(data){
      let state;
      if (vis === 'LE'){                                         
            state = 'life_expectancy';
      }                                                          
                                                                 
      else if (vis === 'GDP'){                                   
          state = 'gdp' ;
      }                                                          
                                                                 
      else if (vis === 'BMI'){                                   
         state = 'bmi';
      }                                                          
                                                                 
      else if (vis === 'IC'){                                    
          state = 'income_resources';
      }                                                          
                                                                 
      else if (vis === 'S'){                                     
          state = 'schooling';
      }

     country_outer_svg.select('image').remove();

     let sortedList = sortingVals(data,state);
                                                                                       
     country_outer_svg                                                                 
         .append('image')                                                              
         .attr('href', function(d){return d['location']})                              
         .attr('width', '2em')                                                         
         .attr('height', '2em')                                                        
         .attr('x', function(d){                                                       
             let w = d['width']                                                        
             let index = getIndex(sortedList, d['name'])
                                                                                       
             return d['width'] + 30 + 15 * (index+1);                                  
                                                                                       
         })                                                                            
         .attr('y', function(d){return d['height']/2 - 10})                            
}
