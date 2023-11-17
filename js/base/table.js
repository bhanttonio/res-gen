

class Table
{
    static #OPTION_COLUMNS = 4;
    static #LINKS_SELECTOR = 'tr td a';
    static #LINKS_ENABLED_CLASS = 'resgen-enabled';
    static #LINKS_DISABLED_CLASS = 'resgen-disabled';

    $tableBody;
    handlerName;
    tableData;

    constructor(config) {
        this.$tableBody = config.$tableBody;
        this.handlerName = config.handlerName;
        this.tableData = new TableData(config);
    }

    // INSERT ROW

    insert(values) {
        this.$tableBody.append( this.rowHtml(values) );
        this.tableData.insert(values);
    }

    rowHtml(values) {
        let tdsHtml = this.valueTdsHtml(values) + this.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    valueTdsHtml(values) {
        return values.map(value => `\t<td>${value}</td>\n`).join('');
    }

    linkTdsHtml() {
        return `\t<td><a href="#" onclick="${this.handlerName}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.select(event)" title="editar">&#x1F589;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handlerName}.remove(event)" title="borrar">&#x2327;</a></td>\n`;
    }

    // SELECT ROW

    indexFrom(event) {
        return $(event.target).parent().parent().index();
    }

    tdValues(index) {
        let $tds = this.$tableBody.children().eq(index).children();
        return $tds
            .slice(0, $tds.length - Table.#OPTION_COLUMNS)
            .toArray()
            .map(td => td.textContent);
    }

    disableOptions() {
        let $links = this.$tableBody.find( Table.#LINKS_SELECTOR );
		$links.removeClass( Table.#LINKS_ENABLED_CLASS );
		$links.addClass( Table.#LINKS_DISABLED_CLASS );
		$links.removeAttr('href');
    }

    // UPDATE ROW

    update(values, index) {
        let tdsHtml = this.valueTdsHtml(values) + this.linkTdsHtml();
        this.$tableBody.children().eq(index).html(tdsHtml);
        this.tableData.update(values, index);
    }

    enableOptions() {
        let $links = this.$tableBody.find( Table.#LINKS_SELECTOR );
		$links.removeClass( Table.#LINKS_DISABLED_CLASS );
		$links.addClass( Table.#LINKS_ENABLED_CLASS );
		$links.attr('href', '#');
    }

    // REMOVE ROW

    referenceName(index, refColumn = 0) {
        let $row = this.$tableBody.children().eq(index);
        return $row.children().eq(refColumn).text();
    }

    delete(index) {
        this.$tableBody.children().eq(index).remove();
        this.tableData.delete(index);
    }

    // MOVE ROW

    moveUp(event) {
        let $rows = this.$tableBody.children();
        let index = this.indexFrom(event);
        let firstIndex = $rows.filter(':first').index();
        
        if ($rows.length > 1 && index > firstIndex) {
            let $prevTds = $rows.eq(index - 1).children();
            let $currTds = $rows.eq(index).children();
            
            this.swapTds($prevTds, $currTds);
            this.tableData.swap(index - 1, index);
            console.log('\u2191 shift up');
        }
    }

    moveDown(event) {
        let $rows = this.$tableBody.children();
        let index = this.indexFrom(event);
        let lastIndex = $rows.filter(':last').index();

        if ($rows.length > 1 && index < lastIndex) {
            let $currTds = $rows.eq(index).children();
            let $nextTds = $rows.eq(index + 1).children();

            this.swapTds($currTds, $nextTds);
            this.tableData.swap(index, index + 1);
            console.log('\u2193 shift down');
        }
    }

    swapTds($tds1, $tds2) { 
        for (let i = 0; i < $tds1.length - Table.#OPTION_COLUMNS; i++) {
            let tmp = $tds1.eq(i).html();
            $tds1.eq(i).html( $tds2.eq(i).html() );
            $tds2.eq(i).html(tmp);
        }
    }
    
    // HELPER

    size() {   // number of rows
        return this.$tableBody.children().length;
    }
    
    hasRows() {
        return this.tableData.data().length > 0;
    }

    deleteRows() {
        this.$tableBody.children().remove();
        this.tableData.clear();
    }

    data() {
        return this.tableData.data();
    }

    load(data) {
        data.forEach(object => {
            let values = (typeof object == 'string') ? [object] : Object.values(object);
            this.insert(values);
        });
    }

}//



class TableData 
{
    #object;
    #propNames;
    #data = [];

    constructor(config) {
        this.#object = config.object;
        this.#propNames = (this.#object instanceof String) ? null : Object.getOwnPropertyNames(this.#object);
    }

    insert(values) {
        this.#data.push( this.objectFrom(values) );
    }

    update(values, index) {
        this.#data[index] = this.objectFrom(values);
    }

    delete(index) {
        this.#data.splice(index, 1);
    }

    swap(index1, index2) {
        let tmp = this.#data[index1];
        this.#data[index1] = this.#data[index2];
        this.#data[index2] = tmp;
    }

    objectFrom(values) {
        if (this.#propNames) {                             // object from values
            let newObject = Object.create(this.#object);   
            this.#propNames.forEach( propName => newObject[propName] = values.shift() );
            return newObject;
        }
        else
            return values[0];                              // string from value
    }

    clear() {
        this.#data = [];
    }

    data() {
        return [...this.#data];
    }

}//



class ExtendedTable extends Table
{
    static BULLET_POINT = '*';
    static LINE_BREAK = '<br>';

    simpleColsSize;   // number of columns with simple values

    constructor(config) {
        super(config);
        this.simpleColsSize = config.simpleColsSize;
    }

    // INSERT ROW

    rowHtml(values) {
        let vals = values.slice(0, this.simpleColsSize);
        let arrays = values.slice(this.simpleColsSize);
        let tdsHtml = super.valueTdsHtml(vals) + this.multiTdsHtml(arrays) + super.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    multiTdsHtml(arrays) {
        let tdsHtml = '';
        arrays.forEach(arr => {
            let content = '';
            arr.forEach(val => {
                content += `${ExtendedTable.BULLET_POINT} ${val} ${ExtendedTable.LINE_BREAK}`
            });
            tdsHtml += `\t<td>${content}</td>\n`;
        });
        return tdsHtml;
    }

    // SELECT ROW

    tdValues(index) {
        let tdValues = [];
        let $tds = this.$tableBody.children().eq(index).children();
        
        $tds.slice(0, this.simpleColsSize)
            .toArray()
            .forEach(td => tdValues.push(td.textContent));

        $tds.slice(this.simpleColsSize, $tds.length - Table.OPTION_COLUMNS)
            .toArray()
            .forEach(td => {
                let arr = new Array();
                if (td.innerHTML.trim() != '') {
                    td.innerHTML.split( ExtendedTable.LINE_BREAK ).forEach(line => {
                        if (line.trim() != '') {
                            arr.push( line.replace(ExtendedTable.BULLET_POINT, '').trim() );
                        }
                    });
                }
                tdValues.push(arr);
            });

        return tdValues;
    }   

    // UPDATE ROW

    update(values, index) {
        let vals = values.slice(0, this.simpleColsSize);
        let arrays = values.slice(this.simpleColsSize);
        let tdsHtml = super.valueTdsHtml(vals) + this.multiTdsHtml(arrays) + super.linkTdsHtml();

        this.$tableBody.children().eq(index).html(tdsHtml);
        this.tableData.update(values, index);
    }

}// 

