

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
                object: new EducationB()
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

