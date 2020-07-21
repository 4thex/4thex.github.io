let Espruino = () => {
  let connection;
  let connect = () => {
    let promise = new Promise((resolve, reject) => {
      Puck.connect(c => {
        connection = c;
        resolve(c);
      });
    });
    return promise;
  };
  let readFile = (name, progress) => {
    let promise = new Promise((resolve, reject) => {
      connection.write(`\x03\x10(function() {
        let storage = require("Storage");
        let file = storage.open("${name}","r");
        let length = file.getLength();
        Bluetooth.println(length);
        let line;
        do {
          line = file.readLine();
          if(line === undefined) {
            Bluetooth.print("x");
          } else {
            Bluetooth.print(line);
          }
        } while (line !== undefined);
      })()\n`, () => {
        // Ready to receive
        let buffer = "";
        let lengthReceived = false;
        let length;
        connection.on("data", data => {
          if(!lengthReceived) {
            let splitIndex = data.indexOf("\n");
            length = Number(data.substr(0, splitIndex));
            data = data.slice(splitIndex+1);
            lengthReceived = true;
          }
          if(data.slice(-1) == "x") {
            resolve(buffer);
          } else {
            progress(`${buffer.length/length}`);
            buffer += data;
          }
        });
      });
    });
    return promise;
  };
  let getGpsFiles = () => {
    let promise = new Promise((resolve, reject) => {
      connection.write(`\x03\x10(function() {
        let storage = require("Storage");
        let files = storage.list(".gpsrc");
        Bluetooth.print(JSON.stringify(files));
        Bluetooth.print("\\n");
      })()\n`, () => {
        // Ready to receive
        let buffer = "";
        let list;
        connection.on("data", data => {
          buffer += data;
          // We are done when we receive a \n
          if(data.slice(-1) == "\n") {
            console.log(buffer);
            list = JSON.parse(buffer);
            let files = list.reduce((acc, item) => {
              if(item.slice(-1) == "\u0001") {
                acc.push(item.slice(0, -1));
              }
              return acc;
            }, []);
            resolve(files);
          }
        });
      });
    });
    return promise;
  };
  return {
    connect: connect,
    getGpsFiles: getGpsFiles,
    readFile: readFile
  };
};
export {Espruino};
