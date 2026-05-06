import * as scan from './scan.js';
import styles from './styles.css' with { type: 'css' };
document.adoptedStyleSheets = [ styles ];
if(!NDEFReader) {
    throw new Error('No Web NFC API support');
}
