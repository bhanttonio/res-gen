
class TableUtil
{
    static #ROWS_SELECTOR = 'tr td a';

    static #CSS_CLASS_LINK_ENABLED  = 'resgen-enabled';
	static #CSS_CLASS_LINK_DISABLED = 'resgen-disabled';


    static indexOfRow(event) {
        return $(event.target).parent().parent().index();
    }


    static moveRowUp($tableBody, event) {
        event.preventDefault();

        let $rows = $tableBody.children();
        let index = TableUtil.indexOfRow(event);
        let firstIndex = $rows.filter(':first').index();
        
        if ($rows.length > 1 && index > firstIndex) 
        {
            let $prevTds = $rows.eq(index - 1).children();
            let $currTds = $rows.eq(index).children();
            
            TableUtil.#swapTds($prevTds, $currTds);
            console.log('\u2191 shift up');
        }
	}

    static moveRowDown($tableBody, event) {
        event.preventDefault();

        let $rows = $tableBody.children();
        let index = TableUtil.indexOfRow(event);
        let lastIndex = $rows.filter(':last').index();

        if ($rows.length > 1 && index < lastIndex) 
        {
            let $currTds = $rows.eq(index).children();
            let $nextTds = $rows.eq(index + 1).children();

            TableUtil.#swapTds($currTds, $nextTds);
            console.log('\u2193 shift down');
        }
	}

    static #swapTds($tds1, $tds2) { 
        for (let i = 0; i < $tds1.length - TABLE_OPTIONS_SIZE; i++) {
            let tmp = $tds1.eq(i).text();
            $tds1.eq(i).text( $tds2.eq(i).text() );
            $tds2.eq(i).text( tmp );
        }
    }


    static disableLinks($tableBody) {
        let $links = $tableBody.find( TableUtil.#ROWS_SELECTOR );
		$links.removeClass( TableUtil.#CSS_CLASS_LINK_ENABLED );
		$links.addClass( TableUtil.#CSS_CLASS_LINK_DISABLED );
		$links.removeAttr('href');
    }

    static enableLinks($tableBody) {
        let $links = $tableBody.find( TableUtil.#ROWS_SELECTOR );
		$links.removeClass( TableUtil.#CSS_CLASS_LINK_DISABLED );
		$links.addClass( TableUtil.#CSS_CLASS_LINK_ENABLED );
		$links.attr('href', '#');
    }


    static formRowContent(fields, handlerName, rowType) {
        let rowStr = '';
        fields.forEach(element => {
            rowStr += `<td>${element.value}</td>\n`;
        });

        switch(rowType) {
            case RowType.REDUCED: 
                rowStr += TableUtil.#reducedLinkRows(handlerName);
                break;
            default: 
                rowStr += TableUtil.#linkRows(handlerName);
        }
        return rowStr;
    }

    static #linkRows(handlerName) {
        return `<td><a href="#" onclick="${handlerName}.moveUp(event)">Subir</a></td>
                <td><a href="#" onclick="${handlerName}.moveDown(event)">Bajar</a></td>
                <td><a href="#" onclick="${handlerName}.select(event)">Editar</a></td>
                <td><a href="#" onclick="${handlerName}.remove(event)">Borrar</a></td>`;
    }

    static #reducedLinkRows(handlerName) {
        return `<td><a href="#" onclick="${handlerName}.moveUp(event)" title="subir">&bigtriangleup;</a></td>
                <td><a href="#" onclick="${handlerName}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>
                <td><a href="#" onclick="${handlerName}.select(event)" title="editar">&#x1F589;</a></td>
                <td><a href="#" onclick="${handlerName}.remove(event)" title="borrar">&#x2327;</a></td>`;
    }


    static obtainRowData($tds) {
        let values = [];
        for (let i = 0; i < $tds.length - TABLE_OPTIONS_SIZE; i++)
            values.push( $tds.eq(i).text() );
        return values;
    }

}//
