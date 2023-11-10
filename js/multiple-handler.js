
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


    // CRUD OPERATIONS

	insert() {
		if (this.isValidForm()) {
			let newRow = this.formRowHtml();
	        this.$tableBody.append(newRow);

			this.resetForm();
			this.taskHandler.resetForm();
			this.toolHandler.resetForm();

			let index = this.$tableBody.children().length - 1;
			console.log(`[${this.HANDLER_NAME}] row ${index} inserted!`);
	    }
	}

	formRowHtml() {
		let tdsHtml = '';
        this.fields.forEach(element => {
            tdsHtml += `<td>${element.value}</td>\n`;
        });

		tdsHtml += this.formTdHtml(this.taskHandler);
		tdsHtml += this.formTdHtml(this.toolHandler);

        tdsHtml += 
        `<td><a href="#" onclick="${this.HANDLER_NAME}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n
         <td><a href="#" onclick="${this.HANDLER_NAME}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n
         <td><a href="#" onclick="${this.HANDLER_NAME}.select(event)" title="editar">&#x1F589;</a></td>\n
         <td><a href="#" onclick="${this.HANDLER_NAME}.remove(event)" title="borrar">&#x2327;</a></td>\n`;

        return `<tr>${tdsHtml}</tr>`;
	}

	formTdHtml(nestedHandler) {
		let tdHtml = '';
		if ( nestedHandler.isTableFilled() ) {
			nestedHandler.$tableBody.children().each( function(index) {
				tdHtml += '* ' + $(this).children().eq(0).text() + '<br>';
			});
		}
		return `<td>${tdHtml}</td>\n`;
	}
	
}//
