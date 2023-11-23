
class FormUtil 
{
    static initCharCounters(elForm) {
        [...elForm.elements]
            .filter(el => ['text', 'textarea'].includes(el.type))
            .forEach(el => $(el).characterCounter());
    }

    static reset(elForm) {
		elForm.reset();
		FormUtil.initCharCounters(elForm);
	}
    
}//
