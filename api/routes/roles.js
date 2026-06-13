var express = require('express');
var router = express.Router();

const Roles = require('../db/models/Roles');
const RolePrivileges = require('../db/models/RolePrivileges');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const role_privileges = require('../config/role_privileges');

router.get('/', async (req, res, next) => {


    try {
        let roles = await Roles.find({});

        res.json(Response.successResponse(roles));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(error);
    }
});

router.post('/add', async (req, res) => {
    console.log("request : ", req.body);
    let body = req.body;
    try {
        if (!body.role_name) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "name field must be filled")
        }
        if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.length == 0) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "permissions field must be an Array")
        }
        let role = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id
        });

        await role.save();

        for (let i = 0; i < body.permissions.length; i++) {
            let priv = new RolePrivileges({
                role_id: role._id,
                permissions: body.permissions[i],
                created_by: req.user?.id
            });
            await priv.save();
        }

        res.json(Response.successResponse({ success: true }));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
})



router.post('/update', async (req, res) => {
    console.log("REQ BODY:", req.body);
    let body = req.body;
    try {

        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id fields must be filled")
        }

        let updates = {};
        if (body.role_name) {
            updates.role_name = body.role_name
        }
        if (typeof body.is_active === "boolean") {
            updates.is_active = body.is_active
        }

        if (
            body.permissions &&
            Array.isArray(body.permissions) &&
            body.permissions.length > 0
        ) {

            let permissions = await RolePrivileges.find({ role_id: body._id });

            let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permission));
            let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permission).includes(x));
            if (removedPermissions.length > 0) {
                await RolePrivileges.remove({ _id: { $in: removedPermissions.map(x => x._id) } });
            }

            if (newPermissions.length > 0) {
                for (let i = 0; i < newPermissions.length; i++) {
                    let priv = new RolePrivileges({
                        role_id: body._id,
                        permissions: newPermissions[i],
                        created_by: req.user?.id
                    });
                    await priv.save();
                }
            }
        }

        //await Roles.updateOne({_id:body._id},updates);
        const result = await Roles.updateOne(
            { _id: body._id },
            updates
        );

        if (result.matchedCount === 0) {
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found",
                "Role not found"
            );
        }
        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete', async (req, res) => {
    console.log("REQ BODY:", req.body);
    let body = req.body;
    try {
        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id fields must be filled")
        }
        await Roles.remove({ _id: body._id });
        // await Roles.deleteOne({ _id: body._id });
        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.get("/role_privileges", (req, res) => {
    res.json(role_privileges);
})

router.get("/:id", async(req,res)=>{

    const role =
        await Roles.findById(req.params.id);

    const permissions =
        await RolePrivileges.find({
            role_id:req.params.id
        });

    res.json({
        role,
        permissions
    });

});

module.exports = router;