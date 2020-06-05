const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');


const users = new Users();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('listaPersona', users.getPeoplePerRoom(data.room));

        client.broadcast
            .to(data.room)
            .emit('crearMensaje', createMessage('Admin', `${data.name} is here!`));

        callback(users.getPeoplePerRoom(data.room));
    });

    client.on('crearMensaje', (data, callback) => {

        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast
            .to(person.room)
            .emit('crearMensaje', message);
        callback(message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);

        client.broadcast
            .to(deletedPerson.room)
            .emit('crearMensaje', createMessage('Admin', `${deletedPerson.name} left`));
        client.broadcast
            .to(deletedPerson.room)
            .emit('listaPersona', users.getPeoplePerRoom(deletedPerson.room));

    });

    //Mensajes privados 
    client.on('mensajePrivado', (data) => {
        let person = users.getPerson(client.id);
        //to(id del client)
        client.broadcast.to(data.for).emit('mensajePrivado', createMessage(person.name, data.message));
    });

});