# EXPORTING BONITA FORMS TO PDF USING PDFMAKE LIBRARY

This is a 

### PREREQUISITES

 - BonitaBPM v6
 - PDFMAKE library: http://pdfmake.org/index.html#/
 - Add a pdf-export="true" attribute to the forms you want to be part of the exported document
 - Add an img element with "logo" as an id and src pointing to PNG or JPEG image
  - Using PNG format requires the mime type to be changed in doc definition

### Usage

With this oneliner one can generate the pdf from bonita form

```javascript
pdfMake.createPdf(new Form2Pdf('Title').parseForm().docDef);
```
