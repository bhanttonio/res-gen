
var educationHandler;
var courseHandler;
var languageHandler;
var skillHandler;
var sectorHandler;

var iweTaskHandler;
var iweToolHandler;


$(function() {
    console.log('loading');
    M.AutoInit();

    educationHandler = new EducationHandler();
    courseHandler = new CourseHandler();
    languageHandler = new LanguageHandler();
    skillHandler = new SkillHandler();
    sectorHandler = new SectorHandler();

    iweTaskHandler = new IweTaskHandler();
    iweToolHandler = new IweToolHandler();

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
        this.#setUpCharCounters();
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

    #setUpCharCounters() {
        console.log('\t\t character counters');
        $('input#name, input#surname_1, input#surname_2, input#level, textarea#profile').characterCounter();
    }

    #setUpDirButtons() {
        console.log('\t\t prev buttons');
        this.#setUpButtons(this.#$btnsPrev);

        console.log('\t\t next buttons');
        this.#setUpButtons(this.#$btnsNext);
    }

    #setUpButtons($btns) {
        $btns.on('click', e => {
            e.preventDefault();
            let tab = e.target.getAttribute('data-tab');
            this.#tabsInstance.select(tab);
        });
    }

    #setUpTabs() {
        console.log('\t\t tabs');

		$(this.#elTabs).on('click', 'a', function(e) {   // on click leave tab's state consistent
			let href = e.target.getAttribute('href');
			console.log(`\u2192 ${href}`);

			if (href !== '#education') {
                educationHandler.exitEditMode();
                // console.log( JSON.stringify(educationHandler.getObjectList(), null, 2) );
            }
			
            if (href != '#courses') {
                courseHandler.exitEditMode();
                // console.log( JSON.stringify(courseHandler.getObjectList(), null, 2) );
            }
            
            if (href != '#languages') {
                languageHandler.exitEditMode();
                // console.log( JSON.stringify(languageHandler.getObjectList(), null, 2) );
            }
            if (href != '#skills') {
                skillHandler.exitEditMode();
                // console.log( JSON.stringify(skillHandler.getObjectList(), null, 2) );
            }
            if (href != '#sectors') {
                sectorHandler.exitEditMode();
                // console.log( JSON.stringify(sectorHandler.getObjectList(), null, 2) );
            }

            if (href != '#int-work-exp') {
                iweTaskHandler.exitEditMode();
                iweToolHandler.exitEditMode();
                // console.log( JSON.stringify(iweToolHandler.getObjectList(), null, 2) );
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
            console.warn('Unable to read \'tab\' param from the URL ');
        }
    }

}//

