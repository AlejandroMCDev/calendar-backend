const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generarJWT } = require('../helpers/jwt');

const createUser = async( req, res = response ) => {

    const { email,password } = req.body;

    try {

        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        user = new User( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();

        const token = await generarJWT( user.id, user.name );
        
        res.status(201).json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        });     
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }

}

const loginUser = async( req, res = response ) => {

    const { email,password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords

        const validPassword = bcrypt.compareSync( password, user.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });            
        }

        const token = await generarJWT( user.id, user.name );

        res.json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const revalidateToken = async( req, res = response ) => {

    const { uid,name } = req;

    const token = await generarJWT( uid, name );

    res.json({
        ok:true,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}