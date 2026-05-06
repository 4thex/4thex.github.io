const writeButton = document.querySelector('#writeButton');
const state = {
    set active(value) {
        writeButton.disabled = value;
    }
};
writeButton.onclick = async () => {
    await write();
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
const write = async () => {
    state.active = true;
    const aborter = controller();
    const signal = aborter.signal;
    const ndef = new NDEFReader();
    try {
        // await ndef.scan({signal});
    } catch (error) {
        console.error(error);
    }
    console.log('Write started');
    ndef.onreading = async event => {
        console.log(`serialNumber: ${event.serialNumber}`);
        aborter.abort();
        // TODO: Write a link to LinkedIn profile
        // ndef.write();
    };
    ndef.onreadingerror = async event => {
        console.error(error);
    };
};