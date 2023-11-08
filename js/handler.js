
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
    
	// AUX VALUES
    FORM_LEGEND;
	INSERT_LEGEND;
    REF_COLUMN = 0;        // used to confirm row deletion (by default is the 1st col in table)
	ROW_TYPE;
    HANDLER_NAME;

	
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
		console.log(`\t ${this.HANDLER_NAME}`);

		this.#initCharCounters();
		this.#initAuxBtn();
		this.#initMainBtn();
	}
    

	// CONFIG METHODS

	initRefs() {
		throw new Error('Abstract method must be implemented!');
	}

	#initCharCounters() {
		FormUtil.initCharCounters(this.elForm);
	}

	#initAuxBtn() {
    	this.$btnAux.on('click', event => {       // on click cancel update or just clean form (in insert mode)
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
    	this.$btnMain.on('click', event => {       // on click update entry or insert a new one
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
			let tdsHtml = TableUtil.formRowContent(this.fields, this.HANDLER_NAME, this.ROW_TYPE);
	        let newRow = `<tr>${tdsHtml}</tr>`;

	        this.$tableBody.append(newRow);
			FormUtil.reset(this.elForm);       // if everything was ok, clean form

			let index = this.$tableBody.children().length - 1;
			console.log(`[${this.HANDLER_NAME}] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.#insertMode) {       // if no update is already in progress, select entry
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.#toUpdateMode();
			let $tds = this.$tableBody.children().eq(index).children();
			
			FormUtil.fill(this.fields, $tds);
			this.elIndex.value = index;

			this.disableLinks();       // while updating an entry, disable links in table
			console.log(`[${this.HANDLER_NAME}] row ${index} selected!`);
		}
	}

    #update() {
		let index = this.elIndex.value;
		if (this.isValidForm()) {
			let updatedRow = TableUtil.formRowContent(this.fields, this.HANDLER_NAME, this.ROW_TYPE);
			this.$tableBody.children().eq(index).html(updatedRow);

			FormUtil.reset(this.elForm);
			this.#toInsertMode();
			this.enableLinks();

			console.log(`[${this.HANDLER_NAME}] row ${index} updated!`);
		}
	}

    remove(event) {
		if (this.#insertMode) {       // if no update is in progress, remove entry
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			let $row = this.$tableBody.children().eq(index);
			let refName = $row.children().eq( this.REF_COLUMN ).text();

			if (confirm(`Se eliminar\xE1 "${refName}"`)) {
				$row.remove();
				console.log(`[${this.HANDLER_NAME}] row ${index} removed!`);
			}
		}
	}

    isValidForm() {
        throw new Error('Abstract method must be implemented!');
	}


    // FORM MODE METHODS

    #toInsertMode() {
		this.$legend.html(this.FORM_LEGEND + this.INSERT_LEGEND);
		this.$btnAux.html(ModuleHandler.#AUX_CLEAN);
		this.$btnMain.html(ModuleHandler.#MAIN_INSERT);
	}

	#toUpdateMode() {
		this.$legend.html(this.FORM_LEGEND + ModuleHandler.#EDIT_LEGEND);
		this.$btnAux.html(ModuleHandler.#AUX_CANCEL);
		this.$btnMain.html(ModuleHandler.#MAIN_UPDATE);
	}

    exitEditMode() {       // while updating an entry, if the user moves to another tab, trigger cancel buton
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

	getObjectList() {       // get table data as an object list
		let list = [];
		let _this = this;

		this.$tableBody.children().each( function(index) {
            let rowData = TableUtil.obtainRowData( $(this).children() );
			rowData.push(index);

			list.push( _this.getObject(rowData) );
        });
        return list;
	}

	getObject(data) {
		throw new Error('Abstract method must be implemented!');
	}

}//
