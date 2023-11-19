
class FormUtil 
{

    static initCharCounters(elForm) {
        [...elForm.elements]
            .filter(el => ['text', 'textarea'].includes(el.type))
            .forEach(el => $(el).characterCounter());
    }

    static reset(elForm) {
		elForm.reset();
		FormUtil.initCharCounters(elForm);
	}

    static fill(fields, $tds) {
        for (let idx = 0; idx < $tds.length - TABLE_OPTIONS_SIZE; idx++) {
            fields[idx].value = $tds.eq(idx).text();
            fields[idx].focus();
        }
    }

}
