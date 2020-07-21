import { Espruino } from "./espruino.js";
import { Graph } from "./graph.js";
let graph;
let espruino = Espruino();
let connectBtn = document.querySelector("#connectBtn");
let progressDiv = document.querySelector("#progress");
connectBtn.addEventListener("click", () => {
  espruino.connect()
    .then(data => {
      return espruino.getGpsFiles();
    })
    .then(data => {
      // The list of files
      console.log(data);
      let filesElement = document.querySelector("#files");
      data.forEach((fileName, i) => {
        let fileElement = document.createElement("a");
        fileElement.setAttribute("href", "");
        fileElement.addEventListener("click", event => {
          espruino.readFile(fileName, progress => {
            progressDiv.innerText = (progress*100).toFixed(0);
          }).then(content => {
            var lines = content.split(/\r?\n/) || [];
            let records = lines.map(line => {
              let record = line.split(/,/) || [];
              return {
                time: new Date(Number(record[0])),
                lat: Number(record[1]),
                lon: Number(record[2]),
                elev: Number(record[3])
              }
            });
            let graph = Graph(records);
            // console.log(records);
          });
          event.preventDefault();
        });
        let fileText = document.createTextNode(fileName);
        fileElement.appendChild(fileText);
        filesElement.appendChild(fileElement);
      });
    });
});
