
class ModuleHandler 
{
    // DOM ELEMENTS
    elForm;
	elIndex;
	fields;

    // JQUERY OBJECTS
    $legend;
	$btnAux;
	$btnMain;
    $tableBody;
    
	// AUX FIELDS
    formLegend;
    refColumn = 0;   // to confirm row deletion (by default is the 1st col in the table)
	rowType;
    handlerName;

    #insertMode = true;   // controls the mode of the form


    // FORM LABELS
    static #EDIT_LEGEND = ' [Edici&oacute;n]';
    static #AUX_CLEAN   = 'Limpiar';
	static #AUX_CANCEL  = 'Cancelar';
	static #MAIN_INSERT = 'Agregar';
	static #MAIN_UPDATE = 'Editar';


	constructor() {
		if (this.constructor == ModuleHandler)
			throw new Error('Abstract class must be implemented!');

		this.initRefs();		
		console.log(`\t ${this.handlerName}`);

		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}
    

	// CONFIG METHODS

	initRefs() {
		throw new Error('Abstract method must be implemented!');
	}

	#initCharCounters() {
		console.log('\t\t character counters');
		FormUtil.initCharCounters(this.elForm);
	}

	#initAuxBtn() {
    	console.log('\t\t aux button');
    	this.$btnAux.on('click', event => {
        	event.preventDefault();
			if (event.target.textContent === ModuleHandler.#AUX_CANCEL) {
				this.#toInsertMode();
				this.enableLinks();
			}
			FormUtil.reset(this.elForm);
			event.target.blur();
    	});
    }

	#initMainBtn() {
    	console.log('\t\t main button');
    	this.$btnMain.on('click', event => {
	        event.preventDefault();
			if (event.target.textContent === ModuleHandler.#MAIN_UPDATE) 
				this.#update();
			else 
				this.#insert();
			event.target.blur();
	    });
    }


    // CRUD OPERATIONS

	#insert() {
		if (this.isValidForm()) {
			let tdsHtml = TableUtil.formRowContent(this.fields, this.handlerName, this.rowType);
	        let newRow = `<tr>${tdsHtml}</tr>`;

	        this.$tableBody.append(newRow);
			FormUtil.reset(this.elForm);

			let index = this.$tableBody.children().length - 1;
			console.log(`[${this.handlerName}] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#insertMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#toUpdateMode();
			let $tds = this.$tableBody.children().eq(index).children();
			
			FormUtil.fill(this.fields, $tds);
			this.elIndex.value = index;

			this.disableLinks();
			console.log(`[${this.handlerName}] row ${index} selected!`);
		}
	}

    #update() {
		let index = this.elIndex.value;
		if (this.isValidForm()) {
			let updatedRow = TableUtil.formRowContent(this.fields, this.handlerName, this.rowType);
			this.$tableBody.children().eq(index).html(updatedRow);

			FormUtil.reset(this.elForm);
			this.#toInsertMode();
			this.enableLinks();

			console.log(`[${this.handlerName}] row ${index} updated!`);
		}
	}

    remove(event) {
		if (this.#insertMode) {
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.$tableBody.children().eq(index);
			let refName = $row.children().eq( this.refColumn ).text();

			if (confirm(`Se eliminar\xE1 "${refName}"`)) {
				$row.remove();
				console.log(`[${this.handlerName}] row ${index} removed!`);
			}
		}
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}


    // FORM MODE METHODS

    #toInsertMode() {
		this.$legend.html(this.formLegend);
		this.$btnAux.html(ModuleHandler.#AUX_CLEAN);
		this.$btnMain.html(ModuleHandler.#MAIN_INSERT);
	}

	#toUpdateMode() {
		this.$legend.html(this.formLegend + ModuleHandler.#EDIT_LEGEND);
		this.$btnAux.html(ModuleHandler.#AUX_CANCEL);
		this.$btnMain.html(ModuleHandler.#MAIN_UPDATE);
	}

    exitEditMode() {
		if (this.#insertMode == false) 
			this.$btnAux.trigger('click');
	}


    // TABLE METHODS
    
	disableLinks() {
		TableUtil.disableLinks(this.$tableBody);
		this.#insertMode = false;
	}

	enableLinks() {
		TableUtil.enableLinks(this.$tableBody);
		this.#insertMode = true;
	}

    moveUp(event) {
		if (this.#insertMode) 
			TableUtil.moveRowUp(this.$tableBody, event);
	}

    moveDown(event) {
		if (this.#insertMode)
			TableUtil.moveRowDown(this.$tableBody, event);
	}

}//
