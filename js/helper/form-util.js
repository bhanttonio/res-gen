
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



class Validator 
{
    
    static isInputNotEmpty(elInput) {
        elInput.value = elInput.value.trim();
        if (elInput.value === '') {
            Validator.#addInvalidStyle(elInput);
            return false;
        }
        return true;
    }


    static isYearRangeValid(elStart, elEnd) {
        elStart.value = elStart.value.trim();
        elEnd.value = elEnd.value.trim();

        let isValidStart = true;
		let isValidEnd = true;

        if ( Validator.#isYearInvalid(elStart.value) ) { 
			this.#addInvalidStyle(elStart);
			isValidStart = false;
		}
		if ( Validator.#isYearInvalid(elEnd.value) || elEnd.value < elStart.value) {
			this.#addInvalidStyle(elEnd);
			isValidEnd = false;
		}

        return isValidStart && isValidEnd;
    }

    static #isYearInvalid(year) {
        return year === '' || isNaN(year) || year < 1000 || year > 9999;
    }


    static isPercentageValid(elPct) {
        elPct.value = elPct.value.trim();
        if (elPct.value === '' || isNaN(elPct.value) || elPct.value < 0 || elPct.value > 100) {
            Validator.#addInvalidStyle(elPct);
            return false;
        }

        elPct.value = Math.round(elPct.value);
        return true;
    }


    static #addInvalidStyle(element) {
		element.classList.add('invalid');
	}

}

