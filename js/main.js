
let basicHandler;
let eduHandler;
let courseHandler;
let langHandler;
let skillHandler;
let sectorHandler;
let iweHandler;
let eweHandler;


$(function() {
    console.log('loading');
    M.AutoInit();

    basicHandler = new BasicHandler( /*
        {name: 'Candidato', surname1: 'Lastname1', surname2: 'Lastname2', level: 'Desarrollador Java Middle', 
         profile: 'Desarrollador de software con más de cinco años de experiencia, mayormente orientado a la implementación y mantenimiento de aplicaciones basadas en Java y frameworks relacionadas.'} 
    */ );
    
        eduHandler = new EducationHandler([
        {name: 'Licenciatura en Informática Administrativa', institute: 'Universidad Nacional Autónoma de México', start: 2015, end: 2020}, 
        {name: 'Maestría en Administración', institute: 'Universidad del Valle de México', start: 2020, end: 2023}
    ]);
    courseHandler = new CourseHandler([
        {name: 'JIRA fundamentals', location: 'TCS internal courses', data: '02/Jul/2022'}, 
        {name: 'Persistencia de datos con Java', location: 'Platzi', data: 'Septiembre 2020'}
    ]);
    langHandler = new LanguageHandler([
        {name: 'Inglés', speak: 50, read: 75, write: 75}, 
        {name: 'Portugués', speak: 25, read: 25, write: 25}
    ]);
    skillHandler = new SkillHandler(['Ingeniería del software: ADOO, UML, Scrum', 'Bases de datos: Oracle, PostgreSQL, MySQL, SQL Server, MongoDB' ]);
    sectorHandler = new SectorHandler(['Bancario', 'Ventas al por menor']);

    iweHandler = new IweHandler( [
        { account: 'Banorte', role: 'Desarrollador Java', project: 'Migración de código', period: 'Enero 2020 - Febrero 2022', 
          tasks: ['Implementación de microservicios con Spring Boot', 'Elaboración de diagramas UML'], 
          tools: ['Herramientas: Eclipse, Visual Paradigm CE, GitHub', 'Tecnologías: Java v8, Maven, Git, JSON'] }, 
        { account: 'Banamex', role: 'Desarrollador SQL', project: 'Migración de datos', period: 'Abril 2022 - Septiembre 2022', 
          tasks: ['Migración de store procedures de Informix a Oracle', 'Diseño y creación de nuevas tablas'], 
          tools: ['Herramientas: DBeaver CE, SQL Developer, Notepad++', 'Tecnologías: Oracle DB v12, Git'] }
    ], 
    ['Diseño e implementación de microservicios con Spring Boot', 'Análisis de requerimientos y creación de diagramas de secuencia y máquinas de estado'], 
    ['Herramientas: Eclipse IDE, WildFly, GitHub, Jira, Akeyless, Checkmarx, Sonarqube', 'Tecnologías: Java, Spring Boot, JUnit, Git, Maven, Docker'] 
    );

    eweHandler = new EweHandler( [
        { company: 'GFI', role: 'Desarrollador Python', period: 'Abril 2017 - Marzo 2018', 
          tasks: ['Refactorización y optimización de código', 'Desarrollo de aplicaciones de prcesamiento de datos'], 
          tools: ['Herramientas: PyCharm, Bitbucket, Jira', 'Tecnologías: Python v3, Pandas, Flask, RedisGraph'] }, 
        { company: 'BCM', role: 'Desarrollador JavaScript', period: 'Octubre 2021 - Agosto 2023', 
          tasks: ['Análisis y documentación de CGIs', 'Diseño e implementación de servicios REST'], 
          tools: ['Herramientas: Sublime Text, Visual Studio Code', 'Tecnologías: HTML, CSS, JavaScript, jQuery'] }
    ], 
    ['Análisis, diseño y programación de nuevo módulo web', 'Refactorización de aplicaciones standalone'], 
    ['Herramientas: GitHub, DBeaver, JBoss, Tomcat', 'Tecnologías: JSP, JAX-RS, HTML, CSS, JavaScript'] 
    );

    new MainHandler();
    console.log('finished');
});


class MainHandler 
{
    #elTabs;
    #tabsInstance;
    #$btnsNext;
    #$btnsPrev;

    constructor() {
        console.log('\t main handler');
        this.#loadRefs();
        this.#setUpDirButtons();
        this.#setUpTabs();
        this.#setUpTabOnLoad();
    }

    #loadRefs() {
        console.log('\t\t references');
        this.#elTabs = document.getElementById('tabs');
        this.#tabsInstance = M.Tabs.getInstance(this.#elTabs);
        this.#$btnsPrev = $('button[id^="btnPrev"]');
        this.#$btnsNext = $('button[id^="btnNext"]');
    }

    #setUpDirButtons() {
        console.log('\t\t prev buttons');
        this.#setUpButtons(this.#$btnsPrev);

        console.log('\t\t next buttons');
        this.#setUpButtons(this.#$btnsNext);
    }

    #setUpButtons($btns) {
        $btns.on('click', event => {
            event.preventDefault();
            let tab = event.target.getAttribute('data-tab');
            this.#tabsInstance.select(tab);
        });
    }

    #setUpTabs() {
        console.log('\t\t tabs');

		$(this.#elTabs).on('click', 'a', function(event) {   // on click leave tab's state consistent
			let href = event.target.getAttribute('href');
			console.log(`\u2192 ${href}`);

            if (href !== '#basic')
                basicHandler.isValidForm();

			if (href !== '#education') 
                eduHandler.exitEditMode();

            if (href != '#courses')
                courseHandler.exitEditMode();

            if (href != '#languages') 
                langHandler.exitEditMode();
            
            if (href != '#skills')
                skillHandler.exitEditMode();

            if (href != '#sectors') 
                sectorHandler.exitEditMode();

            if (href != '#int-work-exp') {
                iweHandler.exitEditMode();
                iweHandler.form.taskHandler.exitEditMode();
                iweHandler.form.toolHandler.exitEditMode();
            }

            if (href != '#ext-work-exp') {
                eweHandler.exitEditMode();
                eweHandler.form.taskHandler.exitEditMode();
                eweHandler.form.toolHandler.exitEditMode();
            }
		});
    }

    #setUpTabOnLoad() {
        try {
            let labels = ['basic', 'education', 'courses', 'languages', 'skills', 'sectors', 'int-work-exp', 'ext-work-exp'];

            let arr = window.location.href.split('?');
            let queryStr = arr.length > 1 ? arr[1] : null;
            let params = queryStr ? queryStr.split('&') : null;
            let tabParam = params ? params[0].split('=') : null;
            let tab = tabParam ? tabParam[1].trim().toLowerCase() : null;

            if (labels.includes(tab)) {
                this.#tabsInstance.select(tab);
            }
        } 
        catch(err) {
            console.warn('Unable to read \'tab\' param from the URL');
        }
    }

}//

