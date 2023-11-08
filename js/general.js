
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



class EducationHandler extends ModuleHandler
{
    static #NAME = 0;
	static #INSTITUTE = 1;
	static #START = 2;
    static #END = 3;
    static #INDEX = 4;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formEdu');
        this.elIndex = this.elForm.elements.indexEdu;

        let elName   = this.elForm.elements.nameEdu;
        let elInstitute  = this.elForm.elements.instituteEdu;
        let elStart   = this.elForm.elements.startEdu;
        let elEnd   = this.elForm.elements.endEdu;
        this.fields = [elName, elInstitute, elStart, elEnd];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxEdu');
        this.$btnMain   = $('#btnMainEdu');
        this.$tableBody = $('table#tableEdu tbody');

        // aux values
        this.FORM_LEGEND  = 'Escolaridad';
        this.INSERT_LEGEND = ' &lsqb;Nueva&rsqb;';
        this.ROW_TYPE     = RowType.REDUCED;
        this.HANDLER_NAME = 'educationHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[EducationHandler.#NAME] ) * 
        Validator.isInputNotEmpty( this.fields[EducationHandler.#INSTITUTE] ) * 
        Validator.isYearRangeValid( this.fields[EducationHandler.#START], this.fields[EducationHandler.#END] );
    }

    getObject(data) {
        return new Education(
            data[EducationHandler.#NAME],
            data[EducationHandler.#INSTITUTE],
            data[EducationHandler.#START],
            data[EducationHandler.#END],
            data[EducationHandler.#INDEX] 
        );
    }

}//



class CourseHandler extends ModuleHandler
{
    static #NAME = 0;
	static #LOCATION = 1;
	static #DATE = 2;
    static #INDEX = 3;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formCourse');
        this.elIndex = this.elForm.elements.indexCourse;

        let elName   = this.elForm.elements.nameCourse;
        let elLocation  = this.elForm.elements.locationCourse;
        let elDate   = this.elForm.elements.dateCourse;
        this.fields = [elName, elLocation, elDate];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxCourse');
        this.$btnMain   = $('#btnMainCourse');
        this.$tableBody = $('table#tableCourse tbody');

        // aux values
        this.FORM_LEGEND  = 'Curso';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.ROW_TYPE     = RowType.REDUCED;
        this.HANDLER_NAME = 'courseHandler';
    }

    isValidForm() {
        // simulates 'non-shortcircuiting and'
        // (necessary to apply all individual validations)
        return Validator.isInputNotEmpty( this.fields[CourseHandler.#NAME] ) * 
               Validator.isInputNotEmpty( this.fields[CourseHandler.#LOCATION] ) * 
               Validator.isInputNotEmpty( this.fields[CourseHandler.#DATE] );
    }

    getObject(data) {
        return new Course(
            data[CourseHandler.#NAME],
            data[CourseHandler.#LOCATION],
            data[CourseHandler.#DATE],
            data[CourseHandler.#INDEX] 
        );
    }

}//



class LanguageHandler extends ModuleHandler
{
    static #NAME  = 0;
	static #SPEAK = 1;
	static #READ  = 2;
    static #WRITE = 3;
    static #INDEX = 4;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formLang');
        this.elIndex = this.elForm.elements.indexLang;

        let elName   = this.elForm.elements.nameLang;
        let elSpeak  = this.elForm.elements.speakLang;
        let elRead   = this.elForm.elements.readLang;
        let elWrite  = this.elForm.elements.writeLang;
        this.fields = [elName, elSpeak, elRead, elWrite];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxLang');
        this.$btnMain   = $('#btnMainLang');
        this.$tableBody = $('table#tableLang tbody');

        // aux values
        this.FORM_LEGEND  = 'Idioma';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.ROW_TYPE     = RowType.REDUCED;
        this.HANDLER_NAME = 'languageHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[LanguageHandler.#NAME] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#SPEAK] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#READ] ) * 
             Validator.isPercentageValid( this.fields[LanguageHandler.#WRITE] );
    }

    getObject(data) {
        return new Language(
            data[LanguageHandler.#NAME],
            data[LanguageHandler.#SPEAK],
            data[LanguageHandler.#READ],
            data[LanguageHandler.#WRITE], 
            data[LanguageHandler.#INDEX] 
        );
    }

}//



class SkillHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formSkill');
        this.elIndex = this.elForm.elements.indexSkill;
        
        let elDesc  = this.elForm.elements.descSkill;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxSkill');
        this.$btnMain   = $('#btnMainSkill');
        this.$tableBody = $('table#tableSkill tbody');

        // aux values
        this.FORM_LEGEND  = 'Conocimiento';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.ROW_TYPE     = RowType.REDUCED;
        this.HANDLER_NAME = 'skillHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[SkillHandler.#DESC] );
    }

    getObject(data) {
        return new Skill(
            data[SkillHandler.#DESC], 
            data[SkillHandler.#INDEX] 
        );
    }

}// 



class SectorHandler extends ModuleHandler
{
    static #DESC  = 0;
    static #INDEX = 1;

    constructor() {
        super();
    }

    initRefs() {
        // dom elements
        this.elForm  = document.getElementById('formSector');
        this.elIndex = this.elForm.elements.indexSector;

        let elDesc  = this.elForm.elements.descSector;
        this.fields = [elDesc];
        
        // jquery objects
        this.$legend    = $(this.elForm).find('legend');
        this.$btnAux    = $('#btnAuxSector');
        this.$btnMain   = $('#btnMainSector');
        this.$tableBody = $('table#tableSector tbody');

        // aux values
        this.FORM_LEGEND  = 'Sector';
        this.INSERT_LEGEND = ' &lsqb;Nuevo&rsqb;';
        this.ROW_TYPE     = RowType.REDUCED;
        this.HANDLER_NAME = 'sectorHandler';
    }

    isValidForm() {
        return Validator.isInputNotEmpty( this.fields[SectorHandler.#DESC] );
    }

    getObject(data) {
        return new Sector(
            data[SectorHandler.#DESC], 
            data[SectorHandler.#INDEX] 
        );
    }

}// 

