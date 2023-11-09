
class MultipleModuleHandler extends ModuleHandler
{

    // NESTED HANDLERS
    taskHandler = new IweTaskHandler();
    toolHandler = new IweToolHandler();


    constructor() {
        super();
    }
    

    // CONFIG METHODS

	initAuxBtn() {
    	this.$btnAux.on('click', event => { 
        	event.preventDefault();

			if (event.target.textContent === AUX_CANCEL) {
				this.toInsertMode();
				this.enableLinks();

				this.taskHandler.deleteTableRows();
				this.toolHandler.deleteTableRows();
			}
			else {
				if (this.taskHandler.isTableFilled() || this.toolHandler.isTableFilled()) {
					if (confirm(`\xBFEliminar tambi\xE9n contenido de tablas\x3F`)) {
						this.taskHandler.deleteTableRows();
						this.toolHandler.deleteTableRows();
					}
				}
			}

			this.resetForm();
			this.taskHandler.resetForm();
			this.toolHandler.resetForm();

			event.target.blur();
    	});
    }


	/*
	initMainBtn() {
    	this.$btnMain.on('click', event => { 
	        event.preventDefault();
			if (event.target.textContent === MAIN_UPDATE) 
				this.update();
			else 
				this.insert();
			event.target.blur();
	    });
    }


    // CRUD OPERATIONS

	insert() {
		if (this.isValidForm()) {
			let tdsHtml = TableUtil.obtainRowHtml(this.fields, this.HANDLER_NAME);
	        let newRow = `<tr>${tdsHtml}</tr>`;

	        this.$tableBody.append(newRow);
			FormUtil.reset(this.elForm);

			let index = this.$tableBody.children().length - 1;
			console.log(`[${this.HANDLER_NAME}] row ${index} inserted!`);
	    }
	}

	select(event) { 
		if (this.insertMode) { 
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.toUpdateMode();
			let $tds = this.$tableBody.children().eq(index).children();
			
			FormUtil.fill(this.fields, $tds);
			this.elIndex.value = index;

			this.disableLinks(); 
			console.log(`[${this.HANDLER_NAME}] row ${index} selected!`);
		}
	}

    update() {
		let index = this.elIndex.value;
		if (this.isValidForm()) {
			let updatedRow = TableUtil.obtainRowHtml(this.fields, this.HANDLER_NAME);
			this.$tableBody.children().eq(index).html(updatedRow);

			FormUtil.reset(this.elForm);
			this.toInsertMode();
			this.enableLinks();

			console.log(`[${this.HANDLER_NAME}] row ${index} updated!`);
		}
	}

    remove(event) {
		if (this.insertMode) { 
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

    toInsertMode() {
		this.$legend.html(this.FORM_LEGEND + this.INSERT_LEGEND);
		this.$btnAux.html(AUX_CLEAN);
		this.$btnMain.html(MAIN_INSERT);
	}

	toUpdateMode() {
		this.$legend.html(this.FORM_LEGEND + EDIT_LEGEND);
		this.$btnAux.html(AUX_CANCEL);
		this.$btnMain.html(MAIN_UPDATE);
	}

    exitEditMode() { 
		if (this.insertMode == false)
			this.$btnAux.trigger('click');
	}


    // TABLE METHODS
    
	disableLinks() {
		TableUtil.disableLinks(this.$tableBody);
		this.insertMode = false;
	}

	enableLinks() {
		TableUtil.enableLinks(this.$tableBody);
		this.insertMode = true;
	}

    moveUp(event) {
		if (this.insertMode) 
			TableUtil.moveRowUp(this.$tableBody, event);
	}

    moveDown(event) {
		if (this.insertMode)
			TableUtil.moveRowDown(this.$tableBody, event);
	}

	getObjectList() { 
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
	*/
}//
