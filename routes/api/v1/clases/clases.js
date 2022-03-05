const express = require("express");
const router = express.Router();
const Clases = require("../../../../dao/clase/clases.model");
const claseModel = new Clases();

router.get("/",(req,res)=>{
    try {
        res.status(200).json({ endpoint: "Clases", update: new Date() });
      } catch (error) {
        res.status(500).json({ status: "failed" });
    }
})



module.exports = router;