
class LanguageHandler
{
	#elForm;
	#elName;
	#elSpeak;
	#elRead;
    #elWrite;
	#elIndex;

	#$legend;
	#$btnAux;
	#$btnMain;
	#$tableBody;

	#enabledMode = true;


	static #FORM_LEGEND_INSERT = 'Idioma';
	static #FORM_LEGEND_UPDATE = 'Idioma [Edici&oacute;n]';

	static #BTN_AUX_CLEAN  = 'Limpiar';
	static #BTN_AUX_CANCEL = 'Anular';

	static #BTN_MAIN_INSERT = 'A&ntilde;adir';
	static #BTN_MAIN_UPDATE = 'Editar';

	static #COL_NAME  = 0;
	static #COL_SPEAK = 1;
	static #COL_READ  = 2;
    static #COL_WRITE = 3;
	

	constructor() {
		console.log('\t language handler');
		this.#loadRefs();
		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}


	#loadRefs() {
		console.log('\t\t references');

		this.#elForm = document.getElementById('formLang');
		this.#elName = this.#elForm.elements.langName;
		this.#elSpeak = this.#elForm.elements.langSpeak;
	    this.#elRead = this.#elForm.elements.langRead;
        this.#elWrite = this.#elForm.elements.langWrite;
		this.#elIndex = this.#elForm.elements.langIndex;

		this.#$legend = $(this.#elForm).find('legend');
		this.#$btnAux = $(this.#elForm.elements.btnAuxLang);
		this.#$btnMain = $(this.#elForm.elements.btnMainLang);
		this.#$tableBody = $('table#tableLang tbody');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	console.log('\t\t aux button');
    	this.#$btnAux.on('click', event => { 
        	event.preventDefault();
			if (event.target.textContent === LanguageHandler.#BTN_AUX_CANCEL) {
				this.#formInInsertMode();
				this.#enableOptions();
			}
			FormUtil.reset(this.#elForm);
			event.target.blur();
    	});
    }

    #initMainBtn() {
    	console.log('\t\t main button');
    	this.#$btnMain.on('click', event => {
	        event.preventDefault();
			if (event.target.textContent === LanguageHandler.#BTN_MAIN_UPDATE) 
				this.#update();
			else 
				this.#insert();
			event.target.blur();
	    });
    }


	#insert() {
		if (this.#isValidForm()) {
	        let newRow = 
	        `<tr>
	            <td>${this.#elName.value}</td>
	            <td>${this.#elSpeak.value}</td>
				<td>${this.#elRead.value}</td>
                <td>${this.#elWrite.value}</td>
				<td><a href="#" onclick="languageHandler.moveUp(event)">&bigtriangleup;</a></td>
				<td><a href="#" onclick="languageHandler.moveDown(event)">&bigtriangledown;</a></td>
	            <td><a href="#" onclick="languageHandler.select(event)">Editar</a></td>
	            <td><a href="#" onclick="languageHandler.remove(event)">Eliminar</a></td>
	        </tr>`;
	        this.#$tableBody.append(newRow);
			FormUtil.reset(this.#elForm);

			let index = this.#$tableBody.children().length - 1;
			console.log(`[language] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#formInUpdateMode();
			let $row = this.#$tableBody.children().eq(index).children();

			this.#elName.value  = $row.eq(LanguageHandler.#COL_NAME).text(); this.#elName.focus();
			this.#elSpeak.value = $row.eq(LanguageHandler.#COL_SPEAK).text(); this.#elSpeak.focus();
			this.#elRead.value  = $row.eq(LanguageHandler.#COL_READ).text(); this.#elRead.focus();
            this.#elWrite.value = $row.eq(LanguageHandler.#COL_WRITE).text(); this.#elWrite.focus();
			this.#elIndex.value = index;

			this.#disableOptions();
			console.log(`[language] row ${index} selected!`);
		}
	}

	#update() {
		let index = this.#elIndex.value;

		if (this.#isValidForm()) {
			let updatedRow = 
			`<td>${this.#elName.value}</td>
	         <td>${this.#elSpeak.value}</td>
			 <td>${this.#elRead.value}</td>
             <td>${this.#elWrite.value}</td>
			 <td><a href="#" onclick="languageHandler.moveUp(event)">&bigtriangleup;</a></td>
			 <td><a href="#" onclick="languageHandler.moveDown(event)">&bigtriangledown;</a></td>
	         <td><a href="#" onclick="languageHandler.select(event)">Editar</a></td>
	         <td><a href="#" onclick="languageHandler.remove(event)">Eliminar</a></td>`;
			 
			this.#$tableBody.children().eq(index).html(updatedRow);

			this.#formInInsertMode();
			FormUtil.reset(this.#elForm);
			this.#enableOptions();

			console.log(`[language] row ${index} updated!`);
		}
	}

	remove(event) {  
		if (this.#enabledMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.#$tableBody.children().eq(index);
			let langName = $row.children().eq(LanguageHandler.#COL_NAME).text();

			if (confirm(`Confirma eliminaci\xF3n de "${langName}"`)) {
				$row.remove();
				console.log(`[language] row ${index} removed!`);
			}
		}
	}


	#isValidForm() {
		return Validator.isInputNotEmpty(this.#elName) * 
               Validator.isPercentageValid(this.#elSpeak) * 
               Validator.isPercentageValid(this.#elRead) * 
               Validator.isPercentageValid(this.#elWrite);
	}


	#formInInsertMode() {
		this.#$legend.html(LanguageHandler.#FORM_LEGEND_INSERT);
		this.#$btnAux.html(LanguageHandler.#BTN_AUX_CLEAN);
		this.#$btnMain.html(LanguageHandler.#BTN_MAIN_INSERT);
	}

	#formInUpdateMode() {
		this.#$legend.html(LanguageHandler.#FORM_LEGEND_UPDATE);
		this.#$btnAux.html(LanguageHandler.#BTN_AUX_CANCEL);
		this.#$btnMain.html(LanguageHandler.#BTN_MAIN_UPDATE);
	}


	#disableOptions() {
		TableUtil.disableLinks(this.#$tableBody);
		this.#enabledMode = false;
	}

	#enableOptions() {
		TableUtil.enableLinks(this.#$tableBody);
		this.#enabledMode = true;
	}

	exitDisabledMode() {  
		if (this.#enabledMode == false)
			this.#$btnAux.trigger('click');
	}


	moveUp(event) {
		if (this.#enabledMode)
			TableUtil.moveRowUp(this.#$tableBody, event);
	}

	moveDown(event) {
		if (this.#enabledMode) 
			TableUtil.moveRowDown(this.#$tableBody, event);
	}


	getLanguages() {
		let langList = new Array();
		this.#$tableBody.children().each( function(idx) {	
			let nam = $(this).children().eq(LanguageHandler.#COL_NAME).text();
			let spe = $(this).children().eq(LanguageHandler.#COL_SPEAK).text();
			let rea = $(this).children().eq(LanguageHandler.#COL_READ).text();
            let wri = $(this).children().eq(LanguageHandler.#COL_WRITE).text();
			langList.push( new Language(nam, spe, rea, wri, idx) );
		});
		return langList;
	}

}//

