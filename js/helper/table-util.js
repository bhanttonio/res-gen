
const TABLE_OPTIONS_SIZE = 4;
const ROWS_SELECTOR = 'tr td a';
const CSS_CLASS_LINK_ENABLED  = 'resgen-enabled';
const CSS_CLASS_LINK_DISABLED = 'resgen-disabled';


class TableUtil
{

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
        let $links = $tableBody.find(ROWS_SELECTOR);
		$links.removeClass(CSS_CLASS_LINK_ENABLED);
		$links.addClass(CSS_CLASS_LINK_DISABLED);
		$links.removeAttr('href');
    }

    static enableLinks($tableBody) {
        let $links = $tableBody.find(ROWS_SELECTOR);
		$links.removeClass(CSS_CLASS_LINK_DISABLED);
		$links.addClass(CSS_CLASS_LINK_ENABLED);
		$links.attr('href', '#');
    }


    static obtainRowHtml(fields, handlerName) {
        let rowStr = '';
        fields.forEach(element => {
            rowStr += `<td>${element.value}</td>\n`;
        });

        rowStr += 
        `<td><a href="#" onclick="${handlerName}.moveUp(event)" title="subir">&bigtriangleup;</a></td>
         <td><a href="#" onclick="${handlerName}.moveDown(event)" title="bajar">&bigtriangledown;</a></td>
         <td><a href="#" onclick="${handlerName}.select(event)" title="editar">&#x1F589;</a></td>
         <td><a href="#" onclick="${handlerName}.remove(event)" title="borrar">&#x2327;</a></td>`;

        return rowStr;
    }

    static obtainRowData($tds) {
        let values = [];
        for (let i = 0; i < $tds.length - TABLE_OPTIONS_SIZE; i++)
            values.push( $tds.eq(i).text() );
        return values;
    }

}//
