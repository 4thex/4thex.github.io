if(!NDEFReader) {
    console.error('No NFC Web API support');
    return;
}

const ndef = new NDEFReader();
const reader = await ndef.scan();
console.log('Scan started');