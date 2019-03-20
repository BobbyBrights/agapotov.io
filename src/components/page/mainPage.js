import React from 'react';
import './style.css'

let lines = document.getElementsByTagName('h2');
let request = require("request");
 request({
   url: 'https://api.tfl.gov.uk/StopPoint/Type/NaptanBusCoachStation',
   json: true
 }, (error, response, data) => {
   if (!error && response.statusCode === 200) {
     for (let i = 0; i < data.length; i++) {
        if (data[i].modes[0] !== 'bus' || data[i].commonName == 'Bus Station' || data[i].commonName == 'Slough Bus Station') continue;

        addBusStation(data[i].id);
        if (lines.length%2 == 0) {
          
          lines[Math.floor(lines.length/2)].innerHTML = data[i].commonName;
        }
        else {
          lines[lines.length-1].style.textAlign = 'right';
          lines[lines.length-1].innerHTML = data[i].commonName;
        }
     }
   }
})

function busStationClick(e) {

  document.getElementById('timetable').style.display = 'block';
  document.getElementById('content').style.display = 'none';
  let tr = document.getElementsByTagName('tr');

  request({
   url: 'https://api.tfl.gov.uk/StopPoint/Type/NaptanBusCoachStation',
   json: true
 }, (error, response, data) => {
   if (!error && response.statusCode === 200) {
     for (let i = 0; i < data.length; i++) { //All StopPoint
        let arrivalsSet = new Set();
        if (data[i].commonName === this.innerHTML) {  //Find clicked StopPoint 
          let trCount = 1;
          for (let j = 0; j < data[i].lineGroup.length; j++) { //Go lineGroups of StopPoint
            request({
              url: `https://api.tfl.gov.uk/StopPoint/${data[i].lineGroup[j].naptanIdReference}/Arrivals`,
              json: true

            }, (error, response, arrivals) => {
              if (!error && response.statusCode === 200) {
                for (let k = 0; k < arrivals.length; k++) {  //Arrivals of this lineGroup
                  
                  addSet(arrivals[k]);
                }
                arrivalsSet.forEach((value, valueAgain, set) => {
                  if (trCount != 1) addTableLine();
                  let tdLine = tr[trCount].getElementsByTagName('td');
                  for (let h = 0; h < 3; h++) {
                    switch(h) {
                      case 0:
                        tdLine[h].innerHTML = value[0];
                        break;
                      case 1:
                        if (value[1] != 'null') tdLine[h].innerHTML = value[1];
                        else tdLine[h].innerHTML = `A${j+1}`;
                        break;
                      case 2:
                        tdLine[h].innerHTML = value[2];
                        break;
                    }
                  }
                  trCount++;
                });

                function addSet(arrival) {
                  let isSameRoute = false;
                  arrivalsSet.forEach((value, valueAgain, map) => {
                    if (value[0] == arrival.lineName) {
                      isSameRoute = true;
                      let arrivalTimeNum = +(arrival.expectedArrival.substr(11,2) + arrival.expectedArrival.substr(14,2));
                      let valueTimeNum = +(value[2].substr(0,2) + value[2].substr(3,2));
                      if (arrivalTimeNum <  valueTimeNum) {
                        console.log(arrivalsSet.delete(value));
                        arrivalsSet.add([arrival.lineName,
                                        arrival.platformName,
                                        arrival.expectedArrival.substr(11,5)
                                        ]);
                        return;
                      }
                    }
                  });
                  if (!isSameRoute) {
                    arrivalsSet.add([arrival.lineName,
                                    arrival.platformName,
                                    arrival.expectedArrival.substr(11,5)
                                    ]);
                  }
                }

                arrivalsSet.clear();
              }
            })
          }      
        }
     }
   }
  })
}

function addBusStation(ID) {
  var newLine = lines[0].cloneNode(true);
  newLine.id = ID;
  newLine.onclick = busStationClick;
  newLine.style.cursor = 'pointer';
  if (lines.length%2 == 1) { 
    document.getElementById('content-left-side').appendChild(newLine);
  }
  else document.getElementById('content-right-side').appendChild(newLine);
}

function addTableLine() {
  let newTr = document.getElementsByTagName('tr')[1].cloneNode(true);
  document.getElementById('table').appendChild(newTr);
}


export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
          <div>
            <div id="timetable" className="top-container">
              <h4><a className='button-close' onClick={()=> {
                document.getElementById('timetable').style.display = 'none';
                document.getElementById('content').style.display = 'block';
                let table = document.getElementById('table');
                let tableLine = table.getElementsByTagName('tr');
                while(tableLine.length > 2) {
                  table.removeChild(tableLine[tableLine.length-1]);
                }

              }}>Close</a></h4>
             
              <table id="table" className="small-container" style={{paddingTop:'80px', fontSize:'20px'}}>
                <thead style={{fontSize:'24px'}}>
                  <tr>
                    <th>Route</th>
                    <th>Platform name</th>
                    <th>Next arrival</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
            </table>

              
            </div>
            <div className="top-container">
              <div className="inner-container">

                
                <div className="small-container" style={{paddingTop:'80px'}}>
                  <h1>This is bus timetable app</h1>
                  <h2>If you want to know the time of arrival of your bus</h2>
                  <p style={{lineHeight: '2.5em'}} className="paragraph">Choose a stop.</p>
                  
                </div>
                <div id='content' className="small-container" style={{marginTop:'50px'}}>
                  <div id='content-left-side'/>
                  <div id='content-right-side'/>
                </div>
                
              </div>
            </div>
        </div>
        );
    }
}




