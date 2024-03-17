const {Router} = require('express');

const router = Router()

router.get('/',(req, res) => {
    res.json("Inside posts route")
})

module.exports  = router