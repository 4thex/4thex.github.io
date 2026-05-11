const scanButton = document.querySelector('#scanButton');
const writeButton = document.querySelector('#writeButton');

const state = {
    set active(value) {
        scanButton.disabled = value;
        writeButton.disabled = value;
    }
};
scanButton.onclick = async () => {
    await scan({write: false});
};
writeButton.onclick = async () => {
    await scan({write: true});
};
const controller = () => {
    const instance = new AbortController();
    instance.signal.onabort = () => {
        state.active = false;
    };
    window.setTimeout(() => {
        instance.abort();
    }, 15000);
    return instance;
};
const scan = async (options) => {
    state.active = true;
    const aborter = controller();
    const signal = aborter.signal;
    const ndef = new NDEFReader();
    try {
        await ndef.scan({signal});
    } catch (error) {
        console.error(error);
        return;
    }
    console.log('Scan started');
    ndef.onreading = async event => {
        console.log(`serialNumber: ${event.serialNumber}`);
        aborter.abort();
        const message = event.message;
        const records = message.records;
        records.forEach(record => {
            console.log('***');
            console.log(`\trecordType: ${record.recordType}`);
            if(record.recordType == 'text') {
                let text = new TextDecoder().decode(record.data);
                console.log(`\tdata: ${text}`);
                return;
            } else if(record.recordType == 'absolute-url') {
                let text = new TextDecoder().decode(record.data);
                console.log(`\tdata: ${text}`);
                return;
            } else if(record.recordType == 'url') {
                let text = new TextDecoder().decode(record.data);
                console.log(`\tdata: ${text}`);
                return;
            }
            console.log(`\tmediaType: ${record.mediaType}`);
            console.log(`\tdata: ${record.data}`);
            let data = record.data;
            if(DataView.prototype.isPrototypeOf(data)) {
                // https://w3c-cg.github.io/web-nfc/#x4-2-the-ndef-record-and-fields
                // | 7| 6| 5| 4| 3|210|
                // |MB|ME|CF|SR|IL|TNF|
                let header = data.getUint8();
                let tnf = header & 0x7;
                console.log(`TNF: ${tnf}`);
                let mb = header >> 7;
                console.log(`MB: ${mb}`);
                let me = (header >> 6) & 0x1;
                console.log(`ME: ${me}`);
                
            }
        });
        if(options.write) {
            let mailto = new DataView(Uint8Array.from([0x6, ...new TextEncoder().encode('info@4thex.com')]).buffer);
            let mailtoRecord = {
                recordType: "mime",
                
                data: mailto
            };
            // The phone reacts to the first tag
            ndef.write({
                records: [
                    // Geo tag
                    {
                        recordType: "url",
                        data: 'geo:39.7538856,-75.5580199'
                    },
                    // Make phone call
                    {
                        recordType: "url",
                        data: 'tel:+12018784072'
                    },
                    // Send email
                    // {
                    //     recordType: "url",
                    //     data: 'mailto:info@4thex.com'
                    // },
                    mailtoRecord,
                    // Browse to web page
                    {
                        recordType: "absolute-url",
                        encoding: "utf-8",
                        data: "https://4thex.com"
                    },
                ]}, {
                overwrite: true
            });
        }
    };
    ndef.onreadingerror = async event => {
        console.error(error);
    };
};