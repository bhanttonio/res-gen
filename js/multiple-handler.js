
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
			let tdsHtml = this.formTdsHtml();
			let newRow = `<tr>${tdsHtml}</tr>`;
	        this.$tableBody.append(newRow);

			this.resetForm();
			this.taskHandler.resetForm();
			this.toolHandler.resetForm();

			this.taskHandler.deleteTableRows();
			this.toolHandler.deleteTableRows();

			let index = this.$tableBody.children().length - 1;
			console.log(`[${this.HANDLER_NAME}] row ${index} inserted!`);
	    }
	}

	formTdsHtml() {
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

        return tdsHtml;
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


	select(event) { 
		if (this.insertMode) { 
			event.preventDefault();
			let index = TableUtil.indexOfRow(event);

			this.toUpdateMode();
			let $tds = this.$tableBody.children().eq(index).children();
			
			this.fillForm($tds);
			this.elIndex.value = index;

			this.disableLinks();
			console.log(`[${this.HANDLER_NAME}] row ${index} selected!`);
		}
	}

	fillForm($tds) {
		let idx;
        for (idx = 0; idx < $tds.length - TABLE_OPTIONS_SIZE - 2; idx++) {
            this.fields[idx].value = $tds.eq(idx).text();
            this.fields[idx].focus();
        }

		if (this.taskHandler.isTableFilled()) {
			this.taskHandler.deleteTableRows();
		}
		this.fillNestedTable($tds.eq(idx).html(), this.taskHandler);

		if (this.toolHandler.isTableFilled()) {
			this.toolHandler.deleteTableRows();
		}
		this.fillNestedTable($tds.eq(++idx).html(), this.toolHandler);
    }

	fillNestedTable(tdHtml, nestedHandler) {
		let rows = '';
		if (tdHtml.trim() != '') {
			let entries = tdHtml.split('<br>');
			
			entries.forEach( element => {
				let value = element.trim();
				if (value != '') {
					value = value.replace('* ', '');
					let tds = `\t<td>${value}</td>\n`;
					tds += 
					`\t<td><a href="#" onclick="${nestedHandler.HANDLER_NAME}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n` +
			    	`\t<td><a href="#" onclick="${nestedHandler.HANDLER_NAME}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n` + 
			    	`\t<td><a href="#" onclick="${nestedHandler.HANDLER_NAME}.select(event)" title="editar">&#x1F589;</a></td>\n` + 
			    	`\t<td><a href="#" onclick="${nestedHandler.HANDLER_NAME}.remove(event)" title="borrar">&#x2327;</a></td>\n`;
					rows += `<tr>\n${tds}\n</tr>\n`;
				}
			});
		}
		nestedHandler.$tableBody.append(rows);
	}


	update() {
		let index = this.elIndex.value;
		if (this.isValidForm()) {
			let updatedTds = this.formTdsHtml();
			this.$tableBody.children().eq(index).html(updatedTds);

			this.resetForm();
			this.taskHandler.resetForm();
			this.toolHandler.resetForm();

			this.taskHandler.deleteTableRows();
			this.toolHandler.deleteTableRows();

			this.toInsertMode();
			this.enableLinks();

			console.log(`[${this.HANDLER_NAME}] row ${index} updated!`);
		}
	}

	getObjectList() {       // get table data as an object list
		let list = [];
		let _this = this;

		this.$tableBody.children().each( function(index) {
            let rowData = _this.obtainRowData( $(this).children() );
			rowData.push(index);

			list.push( _this.getObject(rowData) );
        });
        return list;
	}

	obtainRowData($tds) {
        let values = [];
		let idx;
        for (idx = 0; idx < $tds.length - TABLE_OPTIONS_SIZE - 2; idx++)
            values.push( $tds.eq(idx).text() );

		let tasks = this.obtainNestedRowData( $tds.eq(idx).html() );
		values.push(tasks);

		let tools = this.obtainNestedRowData( $tds.eq(++idx).html() );
		values.push(tools);

        return values;
    }

	obtainNestedRowData(tdHtml) {
		let entries = []
		if (tdHtml.trim() != '') {
			let lines = tdHtml.split('<br>');
			lines.forEach( element => {
				let value = element.trim();
				if (value != '') {
					value = value.replace('* ', '');
					entries.push(value);
				}
			});
		}
		return entries;
	}
	
}//
