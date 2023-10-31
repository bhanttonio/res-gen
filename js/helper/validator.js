
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

    static #addInvalidStyle(element) {
		element.classList.add('invalid');
	}

}
