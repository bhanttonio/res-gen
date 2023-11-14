

class Table
{
    static OPTION_COLUMNS = 4;
    static LINKS_SELECTOR = 'tr td a';
    static LINKS_ENABLED_CLASS = 'resgen-enabled';
    static LINKS_DISABLED_CLASS = 'resgen-disabled';

    $tableBody;
    handler;
    tableData;

    constructor(config) {
        this.$tableBody = config.$tableBody;
        this.handler = config.handler;
        this.tableData = new TableData(config);
    }

    // INSERT ROW

    insert(values) {
        this.$tableBody.append( this.rowHtml(values) );
        this.tableData.insert(values);
    }

    insertRow(values) {
        this.$tableBody.append( this.rowHtml(values) );
    }

    rowHtml(values) {
        let tdsHtml = this.valueTdsHtml(values) + this.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    valueTdsHtml(values) {
        let tdsHtml = '';
        values.forEach( value => {
            tdsHtml += `\t<td>${value}</td>\n`;
        });
        return tdsHtml;
    }

    linkTdsHtml() {
        return `\t<td><a href="#" onclick="${this.handler}.moveUp(event)" title="subir">&bigtriangleup;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handler}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handler}.select(event)" title="editar">&#x1F589;</a></td>\n` + 
               `\t<td><a href="#" onclick="${this.handler}.remove(event)" title="borrar">&#x2327;</a></td>\n`;
    }

    size() {
        return this.$tableBody.children().length;
    }

    // SELECT ROW

    indexFrom(event) {
        return $(event.target).parent().parent().index();
    }

    tdValues(index) {
        let $tds = this.$tableBody.children().eq(index).children();
        return $tds
            .slice(0, $tds.length - Table.OPTION_COLUMNS)
            .toArray()
            .map(td => td.textContent);
    }

    disableOptions() {
        let $links = this.$tableBody.find( Table.LINKS_SELECTOR );
		$links.removeClass( Table.LINKS_ENABLED_CLASS );
		$links.addClass( Table.LINKS_DISABLED_CLASS );
		$links.removeAttr('href');
    }

    // UPDATE ROW

    update(values, index) {
        let tdsHtml = this.valueTdsHtml(values) + this.linkTdsHtml();
        this.$tableBody.children().eq(index).html(tdsHtml);
        this.tableData.update(values, index);
    }

    enableOptions() {
        let $links = this.$tableBody.find( Table.LINKS_SELECTOR );
		$links.removeClass( Table.LINKS_DISABLED_CLASS );
		$links.addClass( Table.LINKS_ENABLED_CLASS );
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
        
        if ($rows.length > 1 && index > firstIndex) 
        {
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

        if ($rows.length > 1 && index < lastIndex) 
        {
            let $currTds = $rows.eq(index).children();
            let $nextTds = $rows.eq(index + 1).children();

            this.swapTds($currTds, $nextTds);
            this.tableData.swap(index, index + 1);
            console.log('\u2193 shift down');
        }
    }

    swapTds($tds1, $tds2) { 
        for (let i = 0; i < $tds1.length - Table.OPTION_COLUMNS; i++) {
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

    data() {
        return this.tableData.data;
    }

    load(data) {
        data.forEach(obj => {
            this.insertRow( Object.values(obj) );
            this.tableData.insertObj(obj);
        });
    }

}//



class TableData 
{
    object;
    propNames;   // object property names
    data = [];   // table data as an array of objects or strings

    constructor(config) {
        this.object = config.object;
        if (typeof this.object === 'string' || this.object instanceof String)
            this.propNames = null;
        else
            this.propNames = Object.getOwnPropertyNames(this.object);
    }

    insert(values) {
        this.data.push( this.objectFrom(values) );
    }

    insertObj(object) {
        this.data.push(object);
    }

    update(values, index) {
        this.data[index] = this.objectFrom(values);
    }

    delete(index) {
        this.data.splice(index, 1);
    }

    swap(index1, index2) {
        let tmp = this.data[index1];
        this.data[index1] = this.data[index2];
        this.data[index2] = tmp;
    }

    objectFrom(values) {
        if (!this.propNames) 
            return values;

        let newObj = JSON.parse(JSON.stringify(this.object));
        this.propNames.forEach( propName => {
            newObj[propName] = values.shift();
        });
        return newObj;
    }

}// 



class TableExtended extends Table
{
    static BULLET_POINT = '*';
    static LINE_BREAK = '<br>';

    simpleCols;   // number of columns containing simple values

    constructor(config) {
        super(config);
        this.simpleCols = config.simpleCols;
    }

    // INSERT ROW

    rowHtml(values) {
        let vals = values.slice(0, this.simpleCols);
        let arrays = values.slice(this.simpleCols);
        let tdsHtml = super.valueTdsHtml(vals) + this.multiTdsHtml(arrays) + super.linkTdsHtml();
        return `<tr>\n${tdsHtml}</tr>\n`;
    }

    multiTdsHtml(arrays) {
        let tdsHtml = '';
        arrays.forEach(arr => {
            let content = '';
            arr.forEach(val => {
                content += `${TableExtended.BULLET_POINT} ${val} ${TableExtended.LINE_BREAK}`
            });
            tdsHtml += `\t<td>${content}</td>\n`;
        });
        return tdsHtml;
    }

    // SELECT ROW

    tdValues(index) {
        let tdValues = [];
        let $tds = this.$tableBody.children().eq(index).children();

        $tds.slice(0, this.simpleColumns)
            .toArray()
            .forEach(td => tdValues.push(td.textContent));

        $tds.slice(this.simpleCols, $tds.length - Table.OPTION_COLUMNS)
            .toArray()
            .forEach(td => {
                let arr = []
                if (td.textContent.trim() != '') 
                    td.textContent.split( TableExtended.LINE_BREAK ).forEach(line => {
                        if (line.trim() != '') 
                            arr.push( line.replace(TableExtended.BULLET_POINT, '').trim() );
                    });
                tdValues.push(arr);
            });

        return tdValues;
    }   

    // UPDATE ROW

    update(values, index) {
        let vals = values.slice(0, this.simpleCols);
        let arrays = values.slice(this.simpleCols);
        let tdsHtml = super.valueTdsHtml(vals) + this.multiTdsHtml(arrays) + super.linkTdsHtml();

        this.$tableBody.children().eq(index).html(tdsHtml);
        this.tableData.update(values, index);
    }

}// 

