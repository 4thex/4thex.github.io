import styles from './styles.css' with { type: 'css' };
document.adoptedStyleSheets = [ styles ];
if(!NDEFReader) {
    throw new Error('No Web NFC API support');
}

const scanButton = document.querySelector('#scanButton');
const state = {
    set active(value) {
        scanButton.disabled = value;
    }
};
scanButton.onclick = async () => {
    await scan();
};
const aborter = new AbortController();
aborter.signal.onabort = () => {
    state.active = false;
};
const scan = async () => {
    state.active = true;
    const ndef = new NDEFReader();
    await ndef.scan({signal: aborter.signal});
    console.log('Scan started');
    ndef.onreading = async event => {
        const message = event.message;
        console.log(`serialNumber: ${event.serialNumber}`);
    };
};