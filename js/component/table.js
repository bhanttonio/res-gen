
class TableComponent
{

    static OPTION_COLUMNS = 4;
    static LINKS_SELECTOR = 'tr td a';
    static LINKS_ENABLED_CLASS = 'resgen-enabled';
    static LINKS_DISABLED_CLASS = 'resgen-disabled';


    $tableBody;
    handlerName;
    tableData;           // handles the table data as an array of objects


    constructor(config) {
        this.$tableBody = config.$tableBody;
        this.handlerName = config.handlerName;
        this.tableData = new TableData(config);
    }


    // INSERT ROW

    insertRow(fieldArray) {
        let rowHtml = this.fieldRowHtml(fieldArray);
        this.$tableBody.append(rowHtml);

        this.tableData.insertObject(fieldArray);
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
        return `\t<td><a href="#" onclick="${this.handlerName}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.select(event)" title="editar">&#x1F589;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.remove(event)" title="borrar">&#x2327;</a></td>\n`;
    }

    rowsNumber() {
        return this.$tableBody.children().length;
    }


    // SELECT ROW

    rowIndexFrom(event) {
        return $(event.target).parent().parent().index();
    }

    $tds(rowIndex, trailingColumnsToDiscard = 0) 
    {
        let $tds = this.$tableBody.children().eq(rowIndex).children();
        let columnsToTake = $tds.length - trailingColumnsToDiscard - TableComponent.OPTION_COLUMNS;

        return $tds.slice(0, columnsToTake);
    }

    disableOptions() {
        let $links = this.$tableBody.find( TableComponent.LINKS_SELECTOR );
		$links.removeClass( TableComponent.LINKS_ENABLED_CLASS );
		$links.addClass( TableComponent.LINKS_DISABLED_CLASS );
		$links.removeAttr('href');
    }


    // UPDATE ROW

    updateRow(fieldArray, rowIndex) {
        let tdsHtml = this.fieldTdsHtml(fieldArray) + this.linkTdsHtml();
        this.$tableBody.children().eq(rowIndex).html(tdsHtml);

        this.tableData.updateObject(fieldArray, rowIndex);
    }

    enableOptions() {
        let $links = this.$tableBody.find( TableComponent.LINKS_SELECTOR );
		$links.removeClass( TableComponent.LINKS_DISABLED_CLASS );
		$links.addClass( TableComponent.LINKS_ENABLED_CLASS );
		$links.attr('href', '#');
    }


    // REMOVE ROW

    referenceName(rowIndex, refColumn = 0) {
        let $row = this.$tableBody.children().eq(rowIndex);
        return $row.children().eq( refColumn ).text();
    }

    deleteRow(rowIndex) {
        this.$tableBody.children().eq(rowIndex).remove();

        this.tableData.deleteObject(rowIndex);
    }


    // MOVE ROW

    moveRowUp(event) {
        let index = this.rowIndexFrom(event);
        let $rows = this.$tableBody.children();
        let firstIndex = $rows.filter(':first').index();

        if ($rows.length > 1 && index > firstIndex) 
        {
            let $prevTds = $rows.eq(index - 1).children();
            let $currTds = $rows.eq(index).children();
            
            this.swapTds($prevTds, $currTds);
            console.log('\u2191 shift up');

            this.tableData.swapObjects(index - 1, index);
        }
    }

    moveRowDown(event) {
        let index = this.rowIndexFrom(event);
        let $rows = this.$tableBody.children();
        let lastIndex = $rows.filter(':last').index();

        if ($rows.length > 1 && index < lastIndex) 
        {
            let $currTds = $rows.eq(index).children();
            let $nextTds = $rows.eq(index + 1).children();

            this.swapTds($currTds, $nextTds);
            console.log('\u2193 shift down');

            this.tableData.swapObjects(index, index + 1);
        }
    }

    swapTds($tds1, $tds2) { 
        for (let i = 0; i < $tds1.length - TableComponent.OPTION_COLUMNS; i++) {
            let tmp = $tds1.eq(i).text();
            $tds1.eq(i).text( $tds2.eq(i).text() );
            $tds2.eq(i).text( tmp );
        }
    }

    
    // HELPER
    
    hasRows() {
        return this.$tableBody.children().length > 0;
    }

    deleteRows() {
        this.$tableBody.children().remove();
    }


    // DATA

    objectArray() {
        return this.tableData.objectArray();
    }

    loadObjectArray(objectArray) {
        this.tableData.loadObjectArray(objectArray, this.linkTdsHtml());
    }

}//



class TableData 
{
    objectType;
    propertyNames;

    objectArray = [];

    constructor(config) {
        this.objectType = config.objectType;
        this.propertyNames = Object.getOwnPropertyNames( this.objectType );
    }

    // CRUD

    objectFrom(fieldArray) {
        let object = window[ this.objectType ];
        for (let i = 0; i < this.propNames.length; i++) 
            object[ this.propNames[i] ] = fieldArray[i].value;
        return object;
    }

    insertObject(fieldArray) {
        this.objectArray.push( this.objectFrom(fieldArray) );
    }

    updateObject(fieldArray, index) {
        this.objectArray[index] = this.objectFrom(fieldArray);
    }

    deleteObject(index) {
        this.objectArray.splice(index, 1);
    }

    // MOVE OBJECT

    swapObjects(index1, index2) {
        let tmp = this.objectArray[index1];
        this.objectArray[index1] = this.objectArray[index2];
        this.objectArray[index2] = tmp;
    }

    // INPUT/OUTPUT

    get objectArray() {
        return [...this.objectArray];
    }

    loadObjectArray(objectArray, linkTdsHtml) {
        let rowsHtml = '';
        objectArray.forEach( object => {
            rowsHtml += this.propRowHtml(object, linkTdsHtml);
        });
        this.$tableBody.html(rowsHtml);
        this.objectArray = objectArray;
    }

    propRowHtml(object, linkTdsHtml) {
        let tdsHtml = this.propTdsHtml(object) + linkTdsHtml;
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    propTdsHtml(object) {
        let tdsHtml = '';
        this.propNames.forEach(propName => {
            tdsHtml += `\t<td>${object[propName]}</td>\n`;
        });
        return tdsHtml;
    }

}// 

