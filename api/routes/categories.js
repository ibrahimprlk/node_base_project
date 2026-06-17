var express = require('express');
var router = express.Router();

const Categories = require('../db/models/Categories');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const AuditLogs = require('../db/models/AuditLogs');
const logger = require('../lib/logger/loggerClass');
const auth = require('../lib/auth')();
const config = require("../config")
const i18n = new (require('../lib/i18n'))(config.DEFAULT_LANG);

const emitter = require("../lib/Emitter");

const excelExport = new (require("../lib/Export"))();
const path = require("path");
const fs = require("fs");
const multer=require("multer");
const Import = new (require("../lib/Import"))();

let multerStorage=multer.diskStorage({
    destination:(req,file,next)=>{
        next(null,config.FILE_UPLOAD_PATH)
    },
    filename:(req,file,next)=>{
        next(null,file.filename+"_"+Date.now()+path.extname(file.originalname));
    }
})

const upload=multer({storage:multerStorage}).single("pb_file");

router.get('/', async (req, res, next) => {
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
        //i18n.translate("COMMON.VALIDATION_ERROR_TITLE")
        // if (!body.name) {
        //     throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user.language), i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user.language,["name"]))
        // }
        let category = new Categories({
            name: req.body.name,
            is_active: true
        });

        await category.save();
        logger.info(req.user?.email, "Categories", "Add", category);
        // AuditLogs.info(req.user?.email,"Categories","Add",category);
        emitter.getEmitter("notifications").emit("messages",{message: category.name+" is added"});

        res.json({ ok: true });

    } catch (error) {
        logger.error(req.user?.email, "Categories", "Add", error);
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

        await AuditLogs.info(req.user?.email, "Categories", "Update", { _id: body._id, ...updates });

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
        AuditLogs.info(req.user?.email, "Categories", "Delete", { _id: body._id });
        res.json(Response.successResponse({ success: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/export", async (req, res) => {
    try {
        const categories = await Categories.find({});

        const excel = excelExport.toExcel(
            ["NAME", "IS ACTIVE", "USER ID", "CREATED AT", "UPDATED AT"],
            ["name", "is_active", "created_by", "created_at", "updated_at"],
            categories
        );

        // tmp klasör yolu
        const dir = path.join(__dirname, "../tmp");

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(
            dir,
            `categories_excel_${Date.now()}.xlsx`
        );

        // ❗ UTF-8 YOK (binary yazıyoruz)
        fs.writeFileSync(filePath, excel);

        res.download(filePath, (err) => {
            if (err) {
                console.log(err);
            }

            // optional cleanup
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/import", upload,async (req, res) => {
    try {
        let file=req.file;
        let body = req.body;

        let rows = Import.fromExcel(file.path);

        for(let i=1;i<rows.length;i++){
            let[name,is_active,user,created_at,updated_at]=rows[i];
            if (name) {
                await Categories.create({
                name,
                is_active,
                created_by:req.user._id
            });
            }
        }
        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(req.body,Enum.HTTP_CODES.CREATED));
       
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;