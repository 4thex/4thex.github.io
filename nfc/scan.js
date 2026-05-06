const scanButton = document.querySelector('#scanButton');
const state = {
    set active(value) {
        scanButton.disabled = value;
    }
};
scanButton.onclick = async () => {
    await scan();
};
const controller = () => {
    const instance = new AbortController();
    instance.signal.onabort = () => {
        state.active = false;
    };
    window.setTimeout(() => {
        instance.abort();
    }, 5000);
    return instance;
};
const scan = async () => {
    state.active = true;
    const aborter = controller();
    const signal = aborter.signal;
    const ndef = new NDEFReader();
    try {
        await ndef.scan({signal});
    } catch (error) {
        console.error(error);
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
            console.log(`\mediaType: ${record.mediaType}`);
        });
    };
    ndef.onreadingerror = async event => {
        console.error(error);
    };
};