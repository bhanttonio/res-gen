
class SimpleTable
{

    static #OPTIONS_SIZE = 4;
    static #LINKS_SELECTOR = 'tr td a';
    static #LINKS_ENABLED_CLASS = 'resgen-enabled';
    static #LINKS_DISABLED_CLASS = 'resgen-disabled';


    #$tableBody;
    #handlerName;
    #refColumn = 0;      // used to confirm row deletion (by default is the 1st col in the table)

    #objectType;
    #propNames;
    #objectArray = [];


    constructor(config) {
        this.#$tableBody  = $(`table#${config.tableId} tbody`);
        this.#handlerName = config.handlerName;
        if (config.refColumn) 
            this.#refColumn = config.refColumn;
        
        this.#objectType  = config.objectType;
        this.#propNames   = Object.getOwnPropertyNames( this.#objectType );
    }


    // INSERT ROW

    insertRow(fieldArray) {
        let rowHtml = this.fieldRowHtml(fieldArray);
        this.#$tableBody.append(rowHtml);

        this.insertObject(fieldArray);
    }

    fieldRowHtml(fieldArray) {
        let tdsHtml = this.fieldTdsHtml(fieldArray) + this.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    fieldTdsHtml(fieldArray) {
        let tdsHtml = '';
        fieldArray.forEach( field => {
            tdsHtml += `\t<td>${field.value}</td>\n`;
        });
        return tdsHtml;
    }

    linkTdsHtml() {
        return `\t<td><a href="#" onclick="${this.#handlerName}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.#handlerName}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.#handlerName}.select(event)" title="editar">&#x1F589;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.#handlerName}.remove(event)" title="borrar">&#x2327;</a></td>\n`;
    }

    rowsNumber() {
        return this.#$tableBody.children().length;
    }


    // SELECT ROW

    rowIndexFrom(event) {
        return $(event.target).parent().parent().index();
    }

    $tds(rowIndex) {
        return this.#$tableBody.children().eq(rowIndex).children();
    }

    disableOptions() {
        let $links = this.#$tableBody.find( TableComponent.#LINKS_SELECTOR );
		$links.removeClass( TableComponent.#LINKS_ENABLED_CLASS );
		$links.addClass( TableComponent.#LINKS_DISABLED_CLASS );
		$links.removeAttr('href');
    }


    // UPDATE ROW

    updateRow(fieldArray, handlerName, rowIndex) {
        let tdsHtml = this.tdsHtml(fieldArray);
        this.#$tableBody.children().eq(rowIndex).html(tdsHtml);

        this.updateObject(fieldArray, rowIndex);
    }

    enableOptions() {
        let $links = this.#$tableBody.find( TableComponent.#LINKS_SELECTOR );
		$links.removeClass( TableComponent.#LINKS_DISABLED_CLASS );
		$links.addClass( TableComponent.#LINKS_ENABLED_CLASS );
		$links.attr('href', '#');
    }


    // REMOVE ROW

    referenceName(rowIndex) {
        let $row = this.#$tableBody.children().eq(rowIndex);
        return $row.children().eq( this.#refColumn ).text();
    }

    deleteRow(rowIndex) {
        this.#$tableBody.children().eq(rowIndex).remove();

        this.removeObject(rowIndex);
    }


    // MOVE ROW

    moveRowUp(event) {
        let index = this.rowIndexFrom(event);
        let $rows = this.#$tableBody.children();
        let firstIndex = $rows.filter(':first').index();

        if ($rows.length > 1 && index > firstIndex) 
        {
            let $prevTds = $rows.eq(index - 1).children();
            let $currTds = $rows.eq(index).children();
            
            this.swapTds($prevTds, $currTds);
            console.log('\u2191 shift up');

            this.swapObjects(index - 1, index);
        }
    }

    moveRowDown(event) {
        let index = this.rowIndexFrom(event);
        let $rows = this.#$tableBody.children();
        let lastIndex = $rows.filter(':last').index();

        if ($rows.length > 1 && index < lastIndex) 
        {
            let $currTds = $rows.eq(index).children();
            let $nextTds = $rows.eq(index + 1).children();

            this.swapTds($currTds, $nextTds);
            console.log('\u2193 shift down');

            this.swapObjects(index, index + 1);
        }
    }

    swapTds($tds1, $tds2) { 
        for (let i = 0; i < $tds1.length - TableComponent.#OPTIONS_SIZE; i++) {
            let tmp = $tds1.eq(i).text();
            $tds1.eq(i).text( $tds2.eq(i).text() );
            $tds2.eq(i).text( tmp );
        }
    }

    
    // DATA

    objectFrom(fieldArray) {
        let object = window[ this.#objectType ];
        for (let idx = 0; idx < this.#propNames.length; idx++) {
            let propName = this.#propNames[idx];
            object[propName] = fieldArray[idx].value;
        }
        return object;
    }

    insertObject(fieldArray) {
        this.#objectArray.push( this.objectFrom(fieldArray) );
    }

    updateObject(fieldArray, index) {
        this.#objectArray[index] = this.objectFrom(fieldArray);
    }

    removeObject(index) {
        this.#objectArray.splice(index, 1);
    }

    swapObjects(index1, index2) {
        let tmp = this.#objectArray[index1];
        this.#objectArray[index1] = this.#objectArray[index2];
        this.#objectArray[index2] = tmp;
    }

    getObjectArray() {
        return [...this.#objectArray];
    }

    loadObjectArray(objectArray) {
        let rowsHtml = '';
        objectArray.forEach( object => {
            rowsHtml += this.propRowHtml(object);
        });
        this.#$tableBody.html(rowsHtml);
    }

    propRowHtml(object) {
        let tdsHtml = this.propTdsHtml(object) + this.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    propTdsHtml(object) {
        let tdsHtml = '';
        this.#propNames.forEach(propName => {
            tdsHtml += `\t<td>${object[propName]}</td>\n`;
        });
        return tdsHtml;
    }


    // HELPER

    optionSize() {
        return TableComponent.#OPTIONS_SIZE;
    }
    
    hasRows() {
        return this.$tableBody.children().length > 0;
    }

    deleteRows() {
        this.$tableBody.children().remove();
    }

}//
