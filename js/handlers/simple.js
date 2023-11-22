
class BasicHandler
{
    #elForm; 
    #elName;
    #elSurname1;
    #elSurname2;
    #elLevel;
    #elProfile;

    #$btnAux;

    constructor() {
        console.log('\t basicHandler');
        this.#initRefs();
        this.#initCharCounters();
        this.#initAuxBtn();
    }

    #initRefs() {
        this.#elForm = document.getElementById('formBasic');
        this.#elName     = this.#elForm.elements.nameBasic;
        this.#elSurname1 = this.#elForm.elements.surname1Basic;
        this.#elSurname2 = this.#elForm.elements.surname2Basic;
        this.#elLevel    = this.#elForm.elements.levelBasic;
        this.#elProfile  = this.#elForm.elements.profileBasic;
        this.$btnAux = $('#btnAuxBasic');
    }

    #initCharCounters() {
		FormUtil.initCharCounters(this.#elForm);
	}

    #initAuxBtn() {
    	this.$btnAux.on('click', event => {
        	event.preventDefault();
			FormUtil.reset(this.#elForm);
			event.target.blur();
    	});
    }

    isValidForm() {
        return Validator.isInputNotEmpty(this.#elName) * 
               Validator.isInputNotEmpty(this.#elSurname1) * 
               Validator.isInputNotEmpty(this.#elSurname2) * 
               Validator.isInputNotEmpty(this.#elLevel) * 
               Validator.isInputNotEmpty(this.#elProfile);
    }

    getObject() {
        return new Basic(
            this.#elName.value, 
            this.#elSurname1.value, 
            this.#elSurname2.value, 
            this.#elLevel.value, 
            this.#elProfile.value);
    }

}//


class EducationHandler extends Handler 
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
                    handlerName: EducationHandler.#HANDLER_NAME, 
                    object: new Education()
                }), 
            data: data, 
            handlerName: EducationHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[EducationHandler.#NAME] ) * 
               Validator.isInputNotEmpty( this.form.fields[EducationHandler.#INSTITUTE] ) * 
               Validator.isYearRangeValid( this.form.fields[EducationHandler.#START], this.form.fields[EducationHandler.#END] );
    }

}//


class CourseHandler extends Handler 
{
    static #HANDLER_NAME = 'courseHandler';
    static #NAME = 1;
	static #LOCATION = 2;
	static #DATE = 3;

    constructor(data) { 
        super({
            form: 
                new Form({ 
                    elForm: document.getElementById('formCourse'),
                    formLegend: 'Curso'
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableCourse tbody'), 
                    handlerName: CourseHandler.#HANDLER_NAME, 
                    object: new Course()
                }), 
            data: data, 
            handlerName: CourseHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[CourseHandler.#NAME] ) * 
               Validator.isInputNotEmpty( this.form.fields[CourseHandler.#LOCATION] ) * 
               Validator.isInputNotEmpty( this.form.fields[CourseHandler.#DATE] );
    }

}//


class LanguageHandler extends Handler 
{
    static #HANDLER_NAME = 'langHandler';
    static #NAME  = 1;
	static #SPEAK = 2;
	static #READ  = 3;
    static #WRITE = 4;

    constructor(data) { 
        super({
            form: 
                new Form({ 
                    elForm: document.getElementById('formLang'),
                    formLegend: 'Idioma'
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableLang tbody'), 
                    handlerName: LanguageHandler.#HANDLER_NAME, 
                    object: new Language()
                }), 
            data: data, 
            handlerName: LanguageHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[LanguageHandler.#NAME] ) * 
               Validator.isPercentageValid( this.form.fields[LanguageHandler.#SPEAK] ) * 
               Validator.isPercentageValid( this.form.fields[LanguageHandler.#READ] ) * 
               Validator.isPercentageValid( this.form.fields[LanguageHandler.#WRITE] );
    }

}//


class SkillHandler extends Handler 
{
    static #HANDLER_NAME = 'skillHandler';
    static #DESC = 1;

    constructor(data) { 
        super({
            form: 
                new Form({ 
                    elForm: document.getElementById('formSkill'),
                    formLegend: 'Conocimiento' 
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableSkill tbody'), 
                    handlerName: SkillHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: SkillHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[SkillHandler.#DESC] );
    }

}//


class SectorHandler extends Handler 
{
    static #HANDLER_NAME = 'sectorHandler';
    static #DESC = 1;

    constructor(data) { 
        super({
            form: 
                new Form({ 
                    elForm: document.getElementById('formSector'),
                    formLegend: 'Sector' 
                }), 
            table: 
                new Table({
                    $tableBody: $('table#tableSector tbody'), 
                    handlerName: SectorHandler.#HANDLER_NAME, 
                    object: new String()
                }), 
            data: data, 
            handlerName: SectorHandler.#HANDLER_NAME
        });
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.form.fields[SectorHandler.#DESC] );
    }

}//

