/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
	//code here...
	var code= $(".codemirror-textarea")[0];
	//questa funzione vuole due parametri:
	// 1)la textarea
	// 2) un oggetto (con l'oggetto in questione si possono andare a specificare alcune proprietà che deve possedere l'editor)
	var editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
		mode:"javascript"
		});
});





