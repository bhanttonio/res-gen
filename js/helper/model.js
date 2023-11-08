
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
	constructor(name, institute, start, end, index) {
		this.name = name;
		this.institute = institute;
		this.start = start;
		this.end = end;
		this.index = index;
	}
}


class Course {
	constructor(name, location, date, index) {
		this.name = name;
		this.location = location;
		this.date = date;
		this.index = index;
	}
}


class Language {
	constructor(name, speak, read, write, index) {
		this.name = name;
		this.speak = speak;
		this.read = read;
        this.write = write;
		this.index = index;
	}
}


class Skill {
	constructor(description, index) {
		this.description = description;
		this.index = index;
	}
}


class Sector {
	constructor(description, index) {
		this.description = description;
		this.index = index;
	}
}


class Task {
    constructor(description, index) {
        this.description = description;
		this.index = index;
    }
}


class Tool {
	constructor(description, index) {
		this.description = description;
		this.index = index;
	}
}

