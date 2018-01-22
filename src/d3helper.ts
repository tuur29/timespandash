
// Source: https://stackoverflow.com/questions/23218174/
export function exportsvg(element: any): void {
    let serializer = new XMLSerializer();
    let source = serializer.serializeToString(element);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');

    //add xml declaration & convert source to URI data scheme.
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    // let content = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([source], {type: 'text/xml+svg'}));
    a.download = 'graph.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
