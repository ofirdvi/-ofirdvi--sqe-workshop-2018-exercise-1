import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var stringParsedCode = JSON.stringify(parsedCode);
        console.log(stringParsedCode); // eslint-disable-line no-console
        var tbody = document.getElementById('tbody');
        var header = document.getElementById('header');
        var th= '<thead><tr><td>' + 'Line' + '</td>' + '<td>' + 'Type' + '</td><td>' + 'Name' + '</td><td>' + 'Cond' + '</td><td>' + 'Value' + '</td></tr></thead>';
        header.innerHTML += th;
        for(var i in parsedCode){
            var tr = '<tr><td>' + parsedCode[i].Line + '</td><td>' + parsedCode[i].Type + '</td><td>' + parsedCode[i].Name + '</td><td>' + parsedCode[i].Cond + '</td><td>' + parsedCode[i].Value + '</td></tr>';
            tbody.innerHTML += tr;
        }
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });

});

