const scanButton = document.querySelector('#scanButton');
scanButton.addEventListener('click', async () => {
    await scan();
});
const scan = async () => {
    if(!NDEFReader) {
        console.error('No Web NFC API support');
    }

    const ndef = new NDEFReader();
    const reader = await ndef.scan();
    console.log('Scan started');
};