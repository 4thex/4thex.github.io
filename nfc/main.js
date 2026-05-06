const scan = () => {
    if(!NDEFReader) {
        console.error('No Web NFC API support');
    }

    const ndef = new NDEFReader();
    const reader = await ndef.scan();
    console.log('Scan started');
};
export {scan};