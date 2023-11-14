

class EduHandler extends Handler 
{
    static NAME = 1;
    static INSTITUTE = 2;
    static START = 3;
    static END = 4;

    constructor(tableData) { 
        super({ 
                elForm: document.getElementById('formEdu'),
                formLegend: 'Escolaridad',
                insertLegend: 'Nueva' 
            }, {
                $tableBody: $('table#tableEdu tbody'),
                handler: 'eduHandler', 
                object: new Education()
            },
            tableData
        ); 
    }

    isValidForm() {
        return Validator.isInputNotEmpty(this.form.fields[EduHandler.NAME]) * 
               Validator.isInputNotEmpty(this.form.fields[EduHandler.INSTITUTE]) * 
               Validator.isYearRangeValid(this.form.fields[EduHandler.START], this.form.fields[EduHandler.END]);
    }

}//


class IweTaskHandler extends Handler
{
    static DESC = 1; 

    constructor(tableData) {
        super({
            elForm:  document.getElementById('formIweTask'), 
            formLegend: 'Actividad',
            insertLegend: 'Nueva' 
        }, {
            $tableBody: $('table#tableIweTask tbody'),
            handler: 'iweHandler.taskHandler', 
            object: new Task()
        }, 
        tableData);
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweTaskHandler.DESC] );
    }

}//

class IweToolHandler extends Handler
{
    static DESC = 1; 

    constructor(tableData) {
        super({
            elForm:  document.getElementById('formIweTool'), 
            formLegend: 'Entorno'
        }, {
            $tableBody: $('table#tableIweTool tbody'),
            handler: 'iweHandler.toolHandler', 
            object: new Tool()
        }, 
        tableData);
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[IweToolHandler.DESC] );
    }

}//

