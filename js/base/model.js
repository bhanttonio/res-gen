
class Basic {
	constructor(name, surname1, surname2, level, profile) {
		this.name = name; 
		this.surname1 = surname1; 
		this.surname2 = surname2;
		this.level = level; 
		this.profile = profile;
	}
}

class Education {
    name; institute; start; end;
}

class Course {
    name; location; date;
}

class Language {
    name; speak; read; write;
}

class IntWorkExp {
    account; role; project; period; tasks = []; tools = [];
}

