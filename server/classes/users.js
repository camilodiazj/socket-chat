class Users {
    constructor() {
        //personas que están conectadas al chat
        this.people = [];
    };

    addPerson(id, name, room) {
        let person = { id, name, room };
        this.people.push(person);
        return this.people;
    };

    getPerson(id) {
        let person = this.people.filter(persona => persona.id === id)[0]; //el [0] es para que regrese la primera posición, dado que 'filter' devuelve un array.
        return person;
    };

    getPeople() {
        return this.people;
    };

    getPeoplePerRoom(room) {
        return this.people.filter(person => person.room === room);
    };

    deletePerson(id) {
        let deletedPerson = this.getPerson(id);
        this.people = this.people.filter(persona => persona.id !== id); //!=
        return deletedPerson;
    };

};

module.exports = {
    Users
};