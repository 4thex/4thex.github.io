import styles from './styles.css' with { type: 'css' };
document.adoptedStyleSheets = [ styles ];
const scanButton = document.querySelector('#scanButton');
// scanButton.addEventListener('click', async () => {
//     await scan();
// });
scanButton.onclick = async () => {
    await scan();
};
const scan = async () => {
    if(!NDEFReader) {
        console.error('No Web NFC API support');
    }

    const ndef = new NDEFReader();
    const reader = await ndef.scan();
    console.log('Scan started');
    reader.onreading = async event => {
        const message = event.message;
        console.log(`serialNumber: ${event.serialNumber}`);
    };
};