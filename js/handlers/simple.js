

class EduHandler extends Handler 
{
    static #HANDLER_NAME = 'eduHandler';
    static #NAME = 1;
    static #INSTITUTE = 2;
    static #START = 3;
    static #END = 4;

    constructor(data) { 
        super({
            form: 
                new Form({ 
                    elForm: document.getElementById('formEdu'),
                    formLegend: 'Escolaridad',
                    insertLegend: 'Nueva' 
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableEdu tbody'),
                    handlerName: EduHandler.#HANDLER_NAME, 
                    object: new Education()
                }), 
            data: data, 
            handlerName: EduHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[EduHandler.#NAME] ) * 
               Validator.isInputNotEmpty( this.form.fields[EduHandler.#INSTITUTE] ) * 
               Validator.isYearRangeValid( this.form.fields[EduHandler.#START], this.form.fields[EduHandler.#END] );
    }

}//

