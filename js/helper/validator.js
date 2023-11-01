
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


    static #addInvalidStyle(element) {
		element.classList.add('invalid');
	}

}
