
class FormUtil 
{

    static initCharCounters(elForm) {
        for (let i = 0; i < elForm.elements.length; i++) 
            if (elForm.elements[i].type == 'text') 
                $(elForm.elements[i]).characterCounter();
            
    }

    static reset(elForm) {
		elForm.reset();
		FormUtil.initCharCounters(elForm);
	}

}

