const express=require("express")
const router=express.Router()
const analyticsController=require("../controllers/analyticsController")

router.post("/dashboard",analyticsController.getDashboard)
router.post("/summary",analyticsController.getSummary)
router.post("/trends",analyticsController.getTrends)

module.exports=router;