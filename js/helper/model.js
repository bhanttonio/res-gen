
class Indexed {
	constructor(index) {
		this.index = index;
	}
}


class Education extends Indexed {
	constructor(name, institute, start, end, index) {
		super(index);
		this.name = name;
		this.institute = institute;
		this.start = start;
		this.end = end;
	}
}


class Course extends Indexed {
	constructor(name, location, date, index) {
		super(index);
		this.name = name;
		this.location = location;
		this.date = date;
	}
}


class Language extends Indexed {
	constructor(name, speak, read, write, index) {
		super(index);
		this.name = name;
		this.speak = speak;
		this.read = read;
        this.write = write;
	}
}


class Skill extends Indexed {
	constructor(description, index) {
		super(index);
		this.description = description;
	}
}


class Sector extends Indexed {
	constructor(description, index) {
		super(index);
		this.description = description;
	}
}


class Task extends Indexed {
    constructor(description, index) {
		super(index);
        this.description = description;
    }
}


class Tool extends Indexed {
	constructor(description, index) {
		super(index);
		this.description = description;
	}
}
