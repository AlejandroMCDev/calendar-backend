const {response, json} = require('express');
const Event = require('../models/EventModel');


const getEvents = async( req, res=response ) => {

    const eventos = await Event.find().populate('user', 'name');


    return res.status(200).json({
        ok: true,
        eventos
    })
}

const createEvents = async( req, res=response ) => {

    const event = new Event( req.body );

    try {
        event.user = req.uid
        const eventoGuardado = await event.save()

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500)-json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const updateEvents = async( req, res=response ) => {

    const eventoId = req.params.id;
    const uid = req.uid

    try {

        const evento = await Event.findById( eventoId );

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Event.findByIdAndUpdate( eventoId, nuevoEvento, {new: true} );

        res.json({
            ok: true,
            evento: eventoActualizado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteEvents = async( req, res=response ) => {

    const eventoId = req.params.id;
    const uid = req.uid

    try {

        const evento = await Event.findById( eventoId );

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de eliminar este evento'
            })
        }

        await Event.findByIdAndDelete( eventoId );

        res.json({ ok: true })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getEvents,
    createEvents,
    updateEvents,
    deleteEvents
}