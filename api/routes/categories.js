var express = require('express');
var router = express.Router();

const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const AuditLogs = require('../db/models/AuditLogs');
const logger = require('../lib/logger/loggerClass');
const auth = require('../lib/auth')();
router.get('/',  async (req, res, next) => {
    try {
        let categories = await Categories.find({});
        res.json(Response.successResponse(categories));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(error);
    }
});

// router.post('/add',async(req,res)=>{
//     let body = req.body;
//     try {
//         if (!body.name) {
//             throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","name fields must be filled")
//         }
//         let category = new Categories({
//             name:body.name,
//             is_active:true,
//             created_by:req.user?.id
//         });

//         await category.save();

//         res.json(Response.successResponse({success:true}));

//     } catch (error) {
//         let errorResponse=Response.errorResponse(error);
//         res.status(errorResponse.code).json(errorResponse);
//     }

// })

router.post('/add', async (req, res) => {
    try {
        let category = new Categories({
            name: req.body.name,
            is_active: true
        });

        await category.save();
        logger.info(req.user?.email, "Categories", "Add",category);
       // AuditLogs.info(req.user?.email,"Categories","Add",category);

        res.json({ ok: true });

    } catch (error) {
        logger.error(req.user?.email, "Categories", "Add",error);
        console.log("SAVE ERROR:", error);
        res.status(500).json(error);
    }
});

router.post('/update', async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id fields must be filled")
        }

        let updates = {};
        if (body.name) {
            updates.name = body.name
        }
        if (typeof body.is_active === "boolean") {
            updates.is_active = body.is_active
        }

        //await Categories.updateOne({_id:body._id},updates);
        const result = await Categories.updateOne(
            { _id: body._id },
            updates
        );

        await AuditLogs.info(req.user?.email,"Categories","Update",{_id:body._id, ...updates});

        if (result.matchedCount === 0) {
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found",
                "Category not found"
            );
        }
        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete', async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id fields must be filled")
        }


        // await Categories.remove({_id:body._id});
        await Categories.deleteOne({ _id: body._id });
        AuditLogs.info(req.user?.email,"Categories","Delete",{_id:body._id});
        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;