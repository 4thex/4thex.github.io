if(!('NDEFReader' in window)) {
    const errorText = 'No Web NFC API support';
    const errorElement = document.createElement('body');
    const text = document.createTextNode(errorText);
    errorElement.appendChild(text);
    document.body = errorElement;
    throw new Error(errorText);
}
const styles = await import('./styles.css', {with: { type: 'css' }});
document.adoptedStyleSheets = [ styles.default ];
import('./scan.js');

